const list = document.getElementById('list-data');
const myForm = document.getElementById('iptForm');
const myFormSelection = document.getElementById('tagSelection');
const mySelectionLength = 4;
let optionsGiven = [];
const tagList = ['tree', 'flower', 'leaf', 'forest', 'garden'];
let tagChosen = "";

function randomTag() {
    const randomIndex = Math.floor(Math.random()*tagList.length);
    return tagList[randomIndex];
};

function updateTag (selectedTag){
    fetch("https://api.tumblr.com/v2/tagged?tag=" + selectedTag + "&api_key=gvItLOR19jpoZKlJETuULt1VxRbSGlPBg6V4uZGU81Bf413UoW")
    .then(function(response){
        if (!response.ok){
            window.alert('There is an error,\n please contact web administrator');    
            return;
        }
        return response.json();
    })
    .then(function(json){
        
        if (!json){
            return;
        }
        list.innerHTML = '';
        const result = json.response;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        for (let i = 0; i < result.length; i++){
            const item = result[i];
            
            if (item.photos != undefined){
                // get image
                const imgSrc = item.photos[0].original_size.url
                
                // get time
                const timeStamp = new Date(1000*item.timestamp) ;
                const dd = ("0" + timeStamp.getDate()).slice(-2);
                const mmmm = monthNames[timeStamp.getMonth()];
                const yyyy = timeStamp.getFullYear();
                const hh = ("0" + timeStamp.getHours()).slice(-2);
                const mm = ("0" + timeStamp.getMinutes()).slice(-2);
                const ss = ("0" + timeStamp.getSeconds()).slice(-2);
                const readableTime = dd + ' ' + mmmm + ' ' + yyyy + ', ' + hh + ':' + mm + ':' + ss;
                
                const li = document.createElement('li');
                const img = document.createElement('img');
                const pDate = document.createElement('p');
                
                img.setAttribute('src', imgSrc);
                pDate.innerHTML = readableTime;
                
                li.appendChild(img);
                li.appendChild(pDate);
                
                list.appendChild(li);

                img.onload = function(){
                    masonry.layout()
                }
            }
        };

        // initialise masonry
        masonry = new Masonry(list, {
            itemSelector: 'li',
        });
        
    })
    .catch(function(err){
        window.alert('There is an issue accessing Tumblr API,\n please try again later');    
    })
};

function listSelections(answer){
    // clear any previous contents
    optionsGiven= [];

    // add in answer first
    optionsGiven.push(answer);

    for (let i = 0; i < mySelectionLength; i++){
        const randPosition = Math.random();
        let tagToInclude = randomTag();

        // randomise tagToInclude again if this has been added
        while (optionsGiven.includes(tagToInclude)){
            tagToInclude = randomTag();
        }

        // randomise the adding position (at the beginning or end)
        if (randPosition < 0.5) {
            optionsGiven.unshift(tagToInclude);
        }
        else {
            optionsGiven.push(tagToInclude);
        }
    }
};

function displaySelections() {
    // clear any previous contents
    if (myFormSelection) {
        myFormSelection.innerHTML = "";
    }

    for (let i = 0; i < optionsGiven.length; i++){
        const tagContainer = document.createElement('p');
        tagContainer.innerHTML = optionsGiven[i].toUpperCase();
        myFormSelection.appendChild(tagContainer);
    }
}

function randSelectionColour() {
    
    for (let i = 0; i < myFormSelection.childElementCount; i++) {
        const currElem = myFormSelection.children[i];
        const r = Math.floor(Math.random()*200) + 55;
        const g = Math.floor(Math.random()*200) + 55;
        const b = Math.floor(Math.random()*200) + 55;

        currElem.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";
    }
}

function gameSetup(){
    // choose new tag
    let prevTag = tagChosen;
    while (prevTag == tagChosen){
        tagChosen = randomTag();
    }
    console.log(tagChosen);

    // run fetch with chosen tag
    updateTag(tagChosen);
    // update selections with random other tags
    listSelections(tagChosen);

    // display selections on html
    displaySelections();

    // Randomise background colour of selections
    randSelectionColour();
}

function htmlSetup() {
    gameSetup();
    
    // initialise selections onclick
    for (let i = 0; i < myFormSelection.childElementCount; i++){
        
        myFormSelection.children[i].onclick = function (event){
            
            const currElem = event.target;
            if (currElem.innerHTML == tagChosen.toUpperCase()){
                alert('You are correct!');
            }
            else {
                alert(currElem.innerHTML + ' is incorrect.\n' + 'The answer is ' + tagChosen.toUpperCase());
            }
            // reset game
            htmlSetup();
        }
    }
};

htmlSetup();