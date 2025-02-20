
function Register() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const regreq = new XMLHttpRequest();
    regreq.open("POST", '/register');
    regreq.setRequestHeader('Content-Type', 'application/json');
    regreq.send(JSON.stringify({
        'regName': username,
        'regPass': password // Corrected to use password input
    }));
    regreq.onreadystatechange= ()=>{
        if(regreq.readyState==4){
            const result = JSON.parse(regreq.response)
            console.log(result.message)
            alert(result.message)
        }
    }
}

