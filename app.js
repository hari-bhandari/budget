const budgetController = (function () {
    const Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;

    }
    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    const calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (val) {
            sum += val.value;

        });
        data.totals[type] = sum;
    };

    const data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function (type, description, value) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                if (value > 0) {
                    newItem = new Expense(ID, description, value);
                }
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem: function (type, id) {
            const ids = data.allItems[type].map(function (current) {
                return current.id;


            });
            const index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');


            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach(function (each) {
                each.calculatePercentage(data.totals.inc);

            });
        },
        getPercentages: function () {
            const allPerc = data.allItems.exp.map(function (current) {
                return current.getPercentage();

            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data);

        }

    }
})();


const UIController = (function () {
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentage: '.item__percentage',
        dateLabel: '.budget__title--month'

    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            document.querySelector(element).insertAdjacentHTML('afterbegin', newHtml)


        },
        deleteListItem: function (DOMId) {
            document.getElementById(DOMId).parentNode.removeChild(document.getElementById(DOMId));

        },
        clearFields: function () {
            var fields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            var fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value = '';
            });
            fieldsArray[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }

        },
        displayMonth: function(){
            const month= new Date().getMonth();
            const year= new Date().getFullYear();
            const monthNames = [ "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December" ];
            document.querySelector(DOMStrings.dateLabel).textContent=monthNames[month]+' '+ year ;



        },
        // displayPercentages: function (percentages) {
        //     const fields = document.querySelectorAll(DOMStrings.expensesPercentage);
        //     const nodeListForEach = function (list, callback) {
        //         for (var i = 0; i < list.length; i++) {
        //             callback(list[i], i);
        //         }
        //
        //     };
        //     nodeListForEach(fields, function (current, index) {
        //         if (percentages[index] > 0) {
        //             current.textContent = percentages[index] + '%';
        //         }else{
        //             current.textContent='---';
        //         }
        //
        //     });

        //
        // },
        getDOMStrings: function () {
            return DOMStrings;
        }


    };


})();


const Controller = (function (budgerCtrl, UICtrl) {
    const setupEventListeners = function () {
        const DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (keyPressed) {
            if (keyPressed.keycode === 13 || keyPressed.which == 13) {
                console.log('enter has been pressed')
            }
        })
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    const updateBudget = function () {
        budgerCtrl.calculateBudget();


        var budget = budgerCtrl.getBudget();
        UICtrl.displayBudget(budget);


    };
    // var updatePercentages = function () {
    //     budgerCtrl.calculatePercentages();
    //     const perc = budgerCtrl.getPercentages();
    //     // UICtrl.displayPercentages(perc);
    //
    //
    // }

    const ctrlAddItem = function () {
        const input = UICtrl.getInput();
        if ((input.description !== "") && (!isNaN(input.value)) && (input.value > 0)) {
            const newItem = budgerCtrl.addItem(input.type, input.description, input.value);
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    };
    var ctrlDeleteItem = function (event) {
        var itemId, splitID, type, ID;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitID = itemId.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgerCtrl.deleteItem(type, ID);
            UICtrl.deleteListItem(itemId);
            updateBudget();
            updatePercentages();


        }
    }
    return {
        init: function () {
            UICtrl.displayMonth();

            console.log('application has Started.');
            setupEventListeners();
            updateBudget();


        }
    }
})(budgetController, UIController);
Controller.init();