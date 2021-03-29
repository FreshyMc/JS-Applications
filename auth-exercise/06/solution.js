function solve() {
  
}

function loadHome(){
  if(sessionStorage.getItem('authToken') == null){
    window.location.pathname = '/home.html';
  }else{
    window.location.pathname = '/homeLogged.html';
  }
}