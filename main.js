let myLibrary = localStorage.getItem('library') ? new Map(JSON.parse(localStorage.getItem('library'))): new Map() ;


function Book(title, author, pages, readStatus,indx){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
    this.bookIndex = indx;
}

function addBookToLibrary(title, author, pages, readStatus){
    const newBook = new Book(title,author,pages,readStatus);
    myLibrary.set(title,newBook);
}

myLibrary.forEach((book,k,m)=>{
    const newBookCard = createNewBookCard(book);
    addtoContainer(newBookCard);
});



const addBookButton = document.querySelector('.addBook');
const cancelButton = document.querySelector('.cancleForm');
const submitButton = document.querySelector('#submitForm');
const bookForm = document.querySelector("#bookForm");


addBookButton.addEventListener('click',activateForm);
cancelButton.addEventListener('click',deactivateForm);




bookForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    //get values
    const bookTitle = document.querySelector('#title');
    const bookAuthor = document.querySelector('#author');
    const bookPages = document.querySelector('#pages');
    const bookFinished = document.querySelector('#read'); 
    if ( bookTitle.value == "" || bookAuthor.value == "" ){
        alert("Title or Author missing"); // Need to change to something different
    } else {
        bookIndex = generateBookIndex();
        const newBookEntry = new Book(bookTitle.value,bookAuthor.value,bookPages.value,bookFinished.checked,bookIndex)
        myLibrary.set(newBookEntry.bookIndex,newBookEntry);
        localStorage.setItem('library', JSON.stringify(Array.from(myLibrary.entries())));

        // Need to exit form.
        const newBookCard = createNewBookCard(newBookEntry);
        addtoContainer(newBookCard);
        deactivateForm();
        [bookTitle, bookAuthor,bookPages].forEach((x)=>{x.value=''});
        bookFinished.checked = false;
    }
})


function toggleReadStatus(e){
    console.log(this.closest('.card'),this.closest('.card').dataset.bookIndex);
    currentBook = myLibrary.get(parseInt(this.closest('.card').dataset.bookIndex));
    console.log(currentBook);
    if (this.innerText.toLowerCase() == 'in progress'){
        this.innerText = 'Completed';
        currentBook.readStatus = true;
        this.closest('.card').classList.add('completed')
    } else {
        this.innerText = 'In Progress';
        currentBook.readStatus = false;
        this.closest('.card').classList.remove('completed')
    }
    localStorage.setItem('library', JSON.stringify(Array.from(myLibrary.entries())));
}


function addtoContainer(bookCard){
    const libraryContainer = document.querySelector('.container');
    libraryContainer.appendChild(bookCard);
    fontSize = parseInt(window.getComputedStyle(bookCard.firstChild).getPropertyValue("font-size"),10);
    console.log(bookCard.firstChild.clientHeight, bookCard.firstChild.scrollHeight);
    while (bookCard.firstChild.clientHeight < bookCard.firstChild.scrollHeight ||
        bookCard.firstChild.clientWidth < bookCard.firstChild.scrollWidth){
        fontSize-=2;
        bookCard.firstChild.style.setProperty("font-size",`${fontSize}px`);
    }
    
}

function activateForm(){
    console.log('Activate');
    bookForm.classList.remove('hideForm');
}
function deactivateForm(){
    console.log('Deactivate');
    bookForm.classList.add('hideForm');
}

function createNewBookCard(newBook){
    const newBookCard = document.createElement('div');
    newBookCard.classList.add('card');
    newBookCard.dataset.bookIndex = newBook.bookIndex;
    const readStatus = {true: "Completed", false:"In Progress"};
    
    const newBookTitle = document.createElement('p');
    newBookTitle.classList.add('booktitle');
    newBookTitle.innerText = newBook.title;
    
    const newBookAuthor = document.createElement('p');
    newBookAuthor.classList.add('bookAuthor')
    newBookAuthor.innerText = newBook.author;

    
    const newBookPages = document.createElement('p');
    newBookPages.classList.add('bookPages');
    newBookPages.innerText = newBook.pages;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('cardButtonContainer');


    const newBookStatus = document.createElement('button');
    newBookStatus.classList.add('bookReadStatus');
    newBookStatus.innerText = readStatus[newBook.readStatus];
    if (newBook.readStatus) newBookCard.classList.add('completed');

    newBookStatus.addEventListener('click',toggleReadStatus);


    const removeBookButton = document.createElement('button');
    removeBookButton.classList.add('removeFromLib');
    removeBookButton.innerText = 'Remove';

    buttonContainer.append(newBookStatus,removeBookButton);

    removeBookButton.addEventListener('click',function(e){
        console.log(this.closest('.card').dataset.bookIndex);
        myLibrary.delete(parseInt(this.closest('.card').dataset.bookIndex));
        this.closest('.card').remove();
        localStorage.setItem('library', JSON.stringify(Array.from(myLibrary.entries())));
    })
    

    newBookCard.append(newBookTitle,newBookAuthor,newBookPages,buttonContainer);
    
    return newBookCard;
}

function generateBookIndex(){
    let bookIndex = Math.floor(Math.random() * (999999-100000)) + 100000;
    while(myLibrary.has(bookIndex)){
        bookIndex = Math.floor(Math.random() * (999999-100000)) + 100000;
    }
    return bookIndex;
}