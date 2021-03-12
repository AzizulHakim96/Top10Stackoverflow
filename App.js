var collapse = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < collapse.length; i++) {
  collapse[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var insideContent = this.nextElementSibling;
    if (insideContent.style.display === "block") {
      insideContent.style.display = "none";
    } else {
      insideContent.style.display = "block";
    }
  });
}

async function opener() {
    var T = "java"
    var newT = document.getElementById("query").value;
    if (newT != null){
        T = newT
    }
    
    var currentDate = Date.now();
    currentDate = Math.floor(currentDate / 1000);
    var aWeekFromNow = currentDate - 604800; //going 168 hours back
    aWeekFromNow = Math.floor(aWeekFromNow);
    
    await top10Questions(1); //10 newest (category1)
    await top10Questions(2); //10 most voted (category2)

    async function top10Questions(categoryID){
        var api;
        if (categoryID === 1){
            api = 'https://api.stackexchange.com/2.2/questions?pagesize=10&fromdate=' + aWeekFromNow + '&todate=' + currentDate + '&order=desc&sort=creation&tagged='+T+'&site=stackoverflow'
        } else if(categoryID === 2){
            api = 'https://api.stackexchange.com/2.2/questions?pagesize=10&fromdate=' + aWeekFromNow + '&todate=' + currentDate + '&order=desc&sort=week&tagged='+T+'&site=stackoverflow'
        }
        var req = new Request(api);
        let jsonBody = await fetch(
            req
        ).then(function(response){
            if (response.ok){
                return response.json();
            }
            throw new Error('Something went wrong!');
        });

        if (jsonBody === null){
            alert('Error')
        }
        var questionBodies = jsonBody.items;
        var associatedAnswers;

        var i;
        for (i = 0; i < questionBodies.length; i++) {
            questionNumber = i + 1;
            categoryQ = "category"+categoryID+"Q"+questionNumber;
            votes = ", Votes: "
            date = ", Date: "
            document.getElementById(categoryQ).innerHTML = questionBodies[i].title + 
            votes.bold()+ questionBodies[i].score +
            date.bold()+ (new Date(questionBodies[i].creation_date*1000)).toLocaleString('en-GB', { timeZone: 'UTC' }-6);
            
            associatedAnswers = await getAnswers(questionBodies[i].question_id);
            categoryA = "category"+categoryID+"A"+questionNumber;
            
            var ans = document.getElementById(categoryA);
            votes2 = " Votes: "
            if(associatedAnswers.length < 1){
                ans.innerHTML = "Not answered!";
            }else{
                ans.innerHTML = associatedAnswers[0].body + 
                votes2.bold()+ associatedAnswers[0].score +
                date.bold()+ (new Date(associatedAnswers[0].creation_date*1000)).toLocaleString('en-GB', { timeZone: 'UTC' }-6);
            }
        }
        return true;
    }
    async function getAnswers(qID){
        var API = "https://api.stackexchange.com/2.2/questions/" + qID + "/answers?&order=desc&sort=votes&site=stackoverflow&filter=!9_bDE(fI5"
        let body = await fetch(
            API
        ).then(function(response){
            if (response.ok){
                return response.json();
            }
            throw new Error('Something went wrong!');
        });
        return body.items;
    }

};