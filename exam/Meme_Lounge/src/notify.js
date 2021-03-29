export function notify(msg){
    let errorBox = document.getElementById('errorBox');
    let errorMsgBox = errorBox.querySelector('#errorBox span');

    errorMsgBox.textContent = msg;
    errorBox.style.display = 'block';

    setTimeout(() => {
        errorBox.style.display = 'none';
    }, 3000);
}