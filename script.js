const loaderSection = document.querySelector('.loader-section');
const mainWordContainerSection = document.querySelector('.main-word-container-section');

const loadLessons = ()=>{
    fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then(res=>res.json())
    .then(datas=>
       {
         console.log(datas.data)
        displayLessons(datas.data)
       })
}

const displayLessons = (datas)=>{
    const container = document.querySelector('.lesson-containers');
    container.innerHTML = '';
    datas.forEach(data=>{
        const a = document.createElement('a');
        a.innerHTML = `
        <a onclick="loadLevelWord(${data?.level_no})" id='lesson-btn-${data.level_no}' class="lesson-button btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i> Lesson -${data?.level_no}</a>

            `
        container.append(a)
    })
}
const loadLevelWord = (id)=>{
    runLoader(true)
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then(res=>res.json())
    .then(data=>
        //grad the clicked lesson button and add active class
        //before that remove all active class from all the button
        {
            removeActiveClass();
        const clickedBtn = document.querySelector(`#lesson-btn-${id}`);
        clickedBtn.classList.add('active');
        printLevelWord(data.data)
    })
   
}
const removeActiveClass = ()=>{
    const lessonButtons = document.querySelectorAll('.lesson-button');
    lessonButtons.forEach(btn=>{
        btn.classList.remove('active')
    })
}

const loadWordDetails = async(id)=>{
    const  res = await fetch(`https://openapi.programming-hero.com/api/word/${id}`);
    const data = await res.json();
    displayWordDetails(data.data);
}
const displayWordDetails = (data)=>{
    const detailsBox = document.querySelector('.details_container');
    detailsBox.innerHTML = `
         <div class=" modal_word_details_card border flex flex-col gap-3 border-gray-300 p-5">
                <h1 class="text-2xl font-bold">${data.word} ( <i class="fa-solid fa-microphone-lines"></i> :${data.pronunciation})</h1>
            <h3 class="text-xl font-semibold">Meaning</h3>
            <h4 class="text-xl">${data.meaning}</h4>
            <h3 class="text-xl font-semibold">Example</h3>
            <h5 class="text-xl">${data.sentence}</h5>
            <h3 class="text-xl font-semibold">সমার্থক শব্দ গুলো</h3>
           <div class="flex gap-2">
             <button  class="btn btn-soft">${data.synonyms[0]}</button>
            <button  class="btn btn-soft">${data.synonyms[1]}</button>
            <button  class="btn btn-soft">${data.synonyms[2]}</button>
           </div>
            </div>
    `;
    document.getElementById('word_modal').showModal()
}
const printLevelWord = (items)=>{
    const selectLevel = document.querySelector('.not-select ');
    const next = document.querySelector('.next-lesson');
    selectLevel.classList.add('hidden')
    if(items.length==0){
        next.classList.remove('hidden')
    }else{
        next.classList.add('hidden')

    }
    const cardContainer = document.querySelector('.card-container');
    cardContainer.innerHTML = '';
    items.forEach(item=>{
        const div = document.createElement('div');
        div.innerHTML = `
             <div class="card bg-white shadow-md p-14">
            <h1 class="font-bold text-3xl pb-2">${item.word?item.word:'not found'}</h1>
            <p class="font-semibold pb-6 ">Meaning /Pronounciation</p>
            <h3 class="text-gray-400 font-semibold">"${item?.meaning? item.meaning:'not found'}/${item?.pronunciation?item.pronunciation:'not found'}"</h3>
        
        <div class="icon pt-5 flex justify-between">
            <div onclick='loadWordDetails(${item.id})' class="bg-[#1a90ff2d] cursor-pointer rounded-full p-1">
            <i  class=" fa-solid fa-circle-info"></i>
                
            </div >
            <div onclick="pronounceWord('${item.word}')" class="bg-[#1a90ff2d] cursor-pointer rounded-full p-1">
            <i class="fa-solid fa-volume-high"></i>

            </div>
        </div>
        </div>
        `
        cardContainer.append(div)
    })  
    runLoader(false)
}

const runLoader = (status)=>{
    if(status==true){
        loaderSection.classList.remove('hidden');
        mainWordContainerSection.classList.add('hidden')
    }else{
        loaderSection.classList.add('hidden');
        mainWordContainerSection.classList.remove('hidden')
    }
}

document.querySelector('.search-button').addEventListener('click',()=>{
    removeActiveClass()
    const searchInputField = document.querySelector('.search-input');
    const val = searchInputField.value.trim().toLowerCase().replace(/\s+/g, '');
    fetch(`https://openapi.programming-hero.com/api/words/all`)
    .then(res=>res.json())
    .then(data=>{

        const allwords = data.data;
        console.log(allwords);
        const filterWrods = allwords.filter(item=>item.word.toLowerCase().includes(val));
        printLevelWord(filterWrods)
    })
})

loadLessons()

function pronounceWord(word) {
    console.log('clicked');
    console.log(word);
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}