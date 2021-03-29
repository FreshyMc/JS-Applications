function loadRepos() {
   let doc = document;
   let responseDiv = doc.getElementById('res');

   let request = new XMLHttpRequest();

   request.addEventListener('readystatechange', function(e){
      if(request.readyState == 4 && request.status == 200){
         responseDiv.innerHTML = '';
         responseDiv.textContent = request.responseText;
      }
   });

   request.open('GET', 'https://api.github.com/users/testnakov/repos');
   request.send();
}