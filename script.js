const totalMoneyIncome=document.querySelector('.total__money-income'),
        totalBalance=document.querySelector('.total__balance'),
        totalMoneyExpenses=document.querySelector('.total__money-expenses'),
        historyList=document.querySelector('.history__list'),
        form=document.getElementById('form'),
        operationName=document.querySelector('.operation__name'),
        operationAmount=document.querySelector('.operation__amount');
localStorage.clear();
let dbOperation=JSON.parse(localStorage.getItem('calc')) || [];

const generateId = () => {
    return `Misa${Math.round(Math.random() * 1e8).toString(16)}`;
};

const renderOperation = (item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(item.amount>=0 ? 'history__item-plus' : 'history__item-minus');
    listItem.innerHTML=`${item.description}
        <span class="history__money">${item.amount} ₽</span>
        <button class="history_delete" data-id="${item.id}">x</button>
    `;
    historyList.append(listItem);
};

const updateBalance = () => {
    const resultIncome = dbOperation
        .filter((element) => element.amount > 0)
        .reduce((result, element)=>result+element.amount, 0);
    totalMoneyIncome.textContent=resultIncome+' ₽';
    const resultSpends = dbOperation
        .filter((element) => element.amount < 0)
        .reduce((result, element)=>result+element.amount, 0);
    totalMoneyExpenses.textContent=resultSpends+' ₽';
    totalBalance.textContent=resultSpends+resultIncome+' ₽';
};

const init = () => {
    historyList.textContent='';
    dbOperation.forEach(renderOperation);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation))
};

const addOperation = (event) => {
    operationName.style.borderColor='';
    operationAmount.style.borderColor='';
    event.preventDefault();
    const operationNameValue=operationName.value,
        operationAmountValue=operationAmount.value;
    if (operationNameValue && operationAmountValue)
    {
        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue,
        };
        dbOperation.push(operation);
        init();
    }
    else 
    {
        if (!operationNameValue)
            operationName.style.borderColor='red';
        if(!operationAmountValue)
            operationAmount.style.borderColor='red';
    }
    operationName.value='';
    operationAmount.value='';
};

const deleteOperation = (event) => {
    const target=event.target;
    if (event.target.classList.contains('history_delete'))
    {
        dbOperation = dbOperation
            .filter(operation => operation.id!==target.dataset.id);
        init();
    }
};

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation);

init();