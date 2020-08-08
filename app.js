

// This Module Handles the UserInterface for us.
var uiControl = (function(){

  var nodelistforeach = function(list, callback){

      for( var i = 0; i < list.length; i++){
        callback(list[i], i);
      };
    }

  var DOMStrings = {
    inputDescription: ".add__description",
    inputType: ".add__type",
    value: ".add__value",
    btn: ".add__btn",
    incomelist: ".income__list",
    expenselist: ".expenses__list",
    budgetview: ".budget__value",
    incomeview: ".budget__income--value",
    expenseView: ".budget__expenses--value",
    percentageView: ".budget__expenses--percentage",
    delete_container: ".container",
    percentage:".item__percentage",
    date:".budget__title--month"
  };

  return {
    getInput: function(){

      return {

      description: document.querySelector(DOMStrings.inputDescription).value,

      type: document.querySelector(DOMStrings.inputType).value,

      value: parseFloat(document.querySelector(DOMStrings.value).value)

    };
  },

  additemlist: function(obj, type){

    var html, newHtml, element;
    // create HTML string with placeholders.
    if( type === "inc" ){
      element = DOMStrings.incomelist
      html ='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }
    else if(type === "exp"){
      element = DOMStrings.expenselist
      html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
    }

    //replace placeholders with actual code data.

    newHtml = html.replace('%id%', obj.id);
    newHtml = newHtml.replace('%description%', obj.description);
    newHtml = newHtml.replace('%value%', obj.value);

    // insert the html into UI through insertAdjacent.
    document.querySelector(element).insertAdjacentHTML("beforeend", newHtml)


  },

   clearinputs: function(){

     var field;
     field = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.value);
     field = [].slice.call(field);

     field.forEach(function(current, index, array){
       current.value = '';
       current.description = '';
     });
     field[0].focus();
   },

   displaybudget: function(obj){

     document.querySelector(DOMStrings.budgetview).textContent ="₹ " + obj.budget;
     document.querySelector(DOMStrings.incomeview).textContent = obj.totalinc;
     document.querySelector(DOMStrings.expenseView).textContent = obj.totalexp;
     document.querySelector(DOMStrings.percentageView).textContent = obj.percentage + "%";


   },

   deleteitem: function(id){

     el = document.getElementById(id);
     el.parentNode.removeChild(el);

   },

   displaypercentage: function(percentage){

      fields = document.querySelectorAll(DOMStrings.percentage);

      nodelistforeach(fields, function(current, index){
        current.textContent = percentage[index] + "%";
      });
    },

    displaymonth: function(){
      var day, year, month

      day = new Date();

      year = day.getFullYear();

      month = day.getMonth();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', "September", 'October', 'November', 'December'];

      document.querySelector(DOMStrings.date).textContent = months[month] + " " + year;

    },

    changed: function(){

      var fields = document.querySelectorAll(
        DOMStrings.inputType + "," +
        DOMStrings.inputDescription + "," +
        DOMStrings.value
      );

      nodelistforeach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMStrings.btn).classList.toggle('red');
    },

   getdomstr: function(){

     return DOMStrings

   }

 };

})();







// This Module Handles the Budget
var budgetControl = (function(){

  var Expense = function(id, des, value){
    this.description = des;
    this.value = value;
    this.id = id;
    this.percentage = -1;
  }

  Expense.prototype.calcper = function(totinc){

    if( totinc > 0){
      this.percentage = Math.round((this.value/totinc) * 100 );
    }
    else
      this.percentage = "...";
  };

  Expense.prototype.getper = function(){
    return this.percentage;
  }

  var Income = function(id, des, value){
    this.description = des;
    this.value = value;
    this.id = id;
  }

  var calculateTotal = function(type){

    var sum = 0;
    for(var i = 0; i < data.allitems[type].length; i++){
      sum = sum + data.allitems[type][i].value;
    };
    data.total[type] = sum;

  }

  var data = {

    allitems:{
      exp:[],
      inc:[]
    },
    total:{
      exp:0,
      inc:0
    },
    budget: 0,
    percentage: -1

  };

  return {
    //function to add items to the list.
    additem: function(des, type, val){

      var newItem, id = 0;

      if( data.allitems[type].length !== 0){

        // calculating id for item to be inserted
        id = (data.allitems[type][(data.allitems[type].length) - 1].id) + 1;

      }

      //inserting item to the lists
      if( type === "exp"){
        newItem = new Expense(id, des, val)
      }else{
        newItem = new Income(id, des, val)
      }
      data.allitems[type].push(newItem);
      return newItem;
    },

    budgettotal: function(){
       // Calculate the total income and expenses

       calculateTotal('exp');
       calculateTotal('inc');

       // Calculate the Budget : income - expenses

        data.budget = data.total.inc - data.total.exp;

       // Calculate the Percentage of expense to the Income.
        if(data.total['inc'] === 0){
          data.percentage = '...';
        }
        else{
        data.percentage = Math.round((data.total['exp'] / data.total['inc']) * 100);
      }
    },

    getbudget: function(){
      return{
        totalinc: data.total['inc'],
        totalexp: data.total['exp'],
        budget: data.budget,
        percentage: data.percentage
      };
    },

    calculatepercentages: function(){

       data.allitems.exp.forEach(function(cur){
         cur.calcper(data.total.inc);
       });
    },

    getperc: function(){
      var allper = data.allitems.exp.map(function(cur){
        return cur.getper();
      });
      return allper;
    },

    deleteItems: function(type, id){
      var ids, index;

      ids = data.allitems[type].map(function(current){
        return current.id
      });

      index = ids.indexOf(id);

      if( index !== -1 ){

        data.allitems[type].splice(index,1);

      }

    },

   testing: function(){
     console.log(data.allitems);
   }

  };
  }
)();







// This handles the events and link UI and Budget Controllers
var controller = (function(UIctrl, bCtrl){

  var setEventListeners = function(){

    var Dom = UIctrl.getdomstr();

    document.querySelector(Dom.btn).addEventListener("click", addbudget);

    document.querySelector(Dom.inputType).addEventListener("change", uiControl.changed);

    document.addEventListener("keypress", function(evt){

      if( evt.key === "Enter"){
        addbudget();
      }

    });

    document.querySelector(Dom.delete_container).addEventListener("click", deleteitem);
  };

  var deleteitem = function(evt){

     var rmitem
     // check if the key pressed is delete
     if( evt.target.classList[0] === "ion-ios-close-outline" ){

       // Get the item to be deleted

       rmitemString = evt.target.parentNode.parentNode.parentNode.parentNode.id;
       rmitem = rmitemString.split("-");
       console.log(parseInt(rmitem[1]));

       // check whether its income or expenses

       if( rmitem[0] === 'income'){
         // delete from inc list

         budgetControl.deleteItems('inc', parseInt(rmitem[1]));
       }
       else{
         // delete from exp list

         budgetControl.deleteItems('exp', parseInt(rmitem[1]));
       }

       // Update UI after Deletion.

       uiControl.deleteitem(rmitemString);

       updatebudget();

     }

  };

  var updatebudget = function(){

    // Calculate the budget

    budgetControl.budgettotal();

    // Return Budget.

    var calculatedBudget = budgetControl.getbudget();

    // Display the Budget in UI.

    uiControl.displaybudget(calculatedBudget);

    //Display Percentage
    updatepercentage();
  }

  var updatepercentage = function(){

    // 1. Calculate the percentage after input
    budgetControl.calculatepercentages();
    // 2. Read the percentages from budget Controller
    var perc = budgetControl.getperc();
    // 3. Update the UI with percentages.
    uiControl.displaypercentage(perc);

  }



  var addbudget = function(){

    var input, newItem

   // Get the input from the field.
  input = UIctrl.getInput();

  if( input.description != "" && input.value != NaN && input.value > 0){


   // Add the item to budget Controller

  newItem = budgetControl.additem(input.description, input.type, input.value);

   // Add the item to UI
  uiControl.additemlist(newItem, input.type);

  // Clear the fields.
  uiControl.clearinputs();

  //calculate and update budget.
  updatebudget();

}



  }

  return {

   init: function(){
   uiControl.displaymonth();
   setEventListeners();
   console.log("Application has started");
   uiControl.displaybudget({
     totalinc: 0,
     totalexp: 0,
     budget: 0,
     percentage: 0
   });

 }
 };


})(uiControl, budgetControl);

controller.init();

// Each of the 3 modules are completely independent of each other and handle thier tasks privately.
