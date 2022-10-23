/**
* Implement the main function here.
* We will pass the result of your SQL query to the this function.
* You should not use any variables starting with '__' in this function. (such as '__result__')
* @param data Result of your SQL query.
*/
function main(data) { 
 // Do remember to return the echart option here.
 const myOption = {
   xAxis: {
     type: 'category',
     data: data.map(i => i.actor_login)
   },
   yAxis: {
     type: 'value'
   },
   series: [
     {
       data: data.map(i => i.comments),
       type: 'bar'
     }
   ]
 };
 return myOption;
}
