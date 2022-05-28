/*      
*      Author: Youngjae Lee
*      
*      Last modified date: 2021 Dec 1
*/

//getting DOM elements

//form elements

const form = document.querySelector('#form');

const descriptionInput = document.querySelector('#description');
const typeInput = document.querySelector('#type');
const amountInput = document.querySelector('#amount');

const error = document.querySelector('#errorMsg');
const totalDebit = document.querySelector('#totalDebits');
const totalCredit = document.querySelector('#totalCredits');

const errorStringLiteral1 = '<p>Please choose a proper type from the drop-down menu</p>';
const errorStringLiteral2 = '<p>The amount must be a positive number</p>';

const displayBody = document.querySelector('#displayBody');

const timerText = document.querySelector('.secs');

let financialList =[];

//timer variables
let timeLeft,timer;

if (timer) resetTimer();


//things that would reset timer
window.onload = resetTimer;
window.onmousemove = resetTimer;
window.onmousedown = resetTimer;
window.ontouchstart = resetTimer;
window.onclick = resetTimer;
window.onkeypress = resetTimer;

//submit event listener
const submitEventListener = function(e){
    e.preventDefault();

    //custom method to clear the error message. It is specified in the very end of this document
    clearErrorMsg();

    //description
    const descriptionValue = descriptionInput.value;

    //selected type
    const selectedType = typeInput.value;

    //Entered amount
    const enteredAmount = amountInput.value;

    //if the user selects improper drop-down option
    if(selectedType == '') 
    {
        const element = document.createRange().createContextualFragment(errorStringLiteral1).children[0];

        error.append(element);
    }

    //if the amount is a negative number
    if(enteredAmount == '' || enteredAmount == 0)
    {
        const element = document.createRange().createContextualFragment(errorStringLiteral2).children[0];

        error.append(element);
    } 

    else
    {
        //generate uid
        const uniqueID = uuidv4().substr(0,8);

        const temporaryObject = {uid:uniqueID, description:descriptionValue, type:selectedType, amount:enteredAmount};

        const tr = render(temporaryObject);

        financialList.push(tr);

        const removeButton = tr.children[3].children[0];

        removeButton.addEventListener('click', onRemoveItem);

        updateDisplay();

        //clearing input at the end
        clearText(descriptionInput, typeInput, amountInput);
    }
}


// Remove event listener function
const onRemoveItem =function(e){
    const userResponse = confirm("Are you sure you want to delete this item?");
    if(userResponse)
    {
        removeFromArray(e.currentTarget.dataset.key, financialList);
        updateDisplay();
    } 
}

const render = function({uid, description, type, amount}){


    const range = document.createRange();
    range.selectNodeContents(displayBody);

    const template= `
    <tr data-key="${uid}" class="${type}">
        <td>${description}</td>
        <td>${type}</td>
        <td class="amount">$${Number.parseFloat(amount).toFixed(2)}</td>
        <td class="tools">
            <i data-key="${uid}" class="delete fa fa-trash-o"></i>
        </td>
    </tr>`;

  const element = range.createContextualFragment(template).children[0];
 
  return element;
}

// Update To Do Item List
const updateDisplay = function(){

    // Clean out the todo list
    displayBody.innerHTML = '';

    financialList.forEach((tr)=>{
        displayBody.append(tr);
    });

    //updating total debit and credit

    updateTotalDebits(financialList);
    updateTotalCredits(financialList);

}

//reset timer
function resetTimer() {

    timerText.textContent='02:00';

    /* Clear the previous interval */
    clearInterval(timer);

    /* Set a new interval */
    timer = startLogOutTimer();
}

//start timer
function startLogOutTimer() {
    const tick = function () {
      const min = String(Math.trunc(timeLeft / 60)).padStart(2, 0);
      const sec = String(timeLeft % 60).padStart(2, 0);
  
      // In each call, print the remaining time to UI
      timerText.textContent = `${min}:${sec}`;
  
      // When 0 seconds, stop timer and reload the page
      if (timeLeft === 0) {
        clearInterval(timer);
        alert('You are timed out. Press OK to refresh the page.');
        location.reload();
      }
        // Decrease 1s
        timeLeft--;
    };
  
    // Set time to 2 minutes
    timeLeft = 120;
  
    // Call the timer every second
    const interval = setInterval(tick, 1000);
  
    return interval;
  };

//On init
const onAppInit = function(){

    //add the event listener for submit and reset
    form.addEventListener('submit', submitEventListener);
}

//adding load event listener
window.addEventListener('load', onAppInit);



// custom methods--------------------------------------------------------------------------------------

const updateTotalDebits = function(arr){
    const final = arr.reduce(function(acc,cur){
        if(cur.children[1].textContent === 'debit'){
            return acc + Number.parseFloat(cur.children[2].textContent.substr(1));
        } 
        else return acc;
    }
, 0)

    if(final) totalDebit.textContent = `$${final.toFixed(2)}`;
    else totalDebit.textContent = '$0.00';
} 

const updateTotalCredits = function(arr){
    const final = arr.reduce(function(acc,cur){
        if(cur.children[1].textContent === 'credit'){
            return acc + Number.parseFloat(cur.children[2].textContent.substr(1));
        } 
        else return acc;
    }
, 0)

    if(final) totalCredit.textContent = `$${final.toFixed(2)}`;
    else totalCredit.textContent = '$0.00';
} 
//removing item from array
const removeFromArray = function(uid, arr){
    const newList = arr.filter(x => x.dataset.key != uid);
    financialList = newList;
} 

//clear the text of elements. Argument is text element and indefinite number of argument is allowed
const clearText = function(...element){
    element.forEach(value => value.value = '');
}

//clears the error text in the error object
const clearErrorMsg = function(){
    error.textContent = '';
}