function Register() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const regreq = new XMLHttpRequest();
    regreq.open("post", '/register');
    regreq.setRequestHeader('Content-Type', 'application/json');
    regreq.send(JSON.stringify({
        'regName': username,
        'regPass': password // Corrected to use password input
    }));
    regreq.onreadystatechange = () => {
        if (regreq.readyState == 4) {
            const result = JSON.parse(regreq.response)
            console.log(result.message)
            if (regreq.status == 200) {
                showAlert(result.message, "check")
            } else if (regreq.status == 403) {
                showAlert(result.message, "")
            } else {
                showAlert(result.message, "info")
            }
        }
    }
}

function Login() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const LoginRequest = new XMLHttpRequest()

    LoginRequest.open("post", '/login')
    LoginRequest.setRequestHeader('Content-Type', 'application/json')
    LoginRequest.send(JSON.stringify({
        'loginName': username,
        'loginPass': password
    }))
    LoginRequest.onreadystatechange = () => {
        if (LoginRequest.readyState == 4) {
            if (LoginRequest.status == 200) {
                const result = JSON.parse(LoginRequest.response)
                console.log(result.response)
                showAlert("Sikeres bejelentkezés", "check")

            } else {
                showAlert("Sikertelen bejelentkezés", "")
            }
        }
    }
}


function showAlert(text, type) {
    const alertDiv = document.createElement('div')
    const alertText = document.createElement('p')
    const br = document.createElement('br')
    const alertImg = document.createElement('img')

    alertText.innerText = text
    alertImg.src = "assets/info2.png"


    document.body.appendChild(alertDiv)
    alertDiv.appendChild(alertImg)
    alertDiv.appendChild(br)
    alertDiv.appendChild(alertText)


    alertDiv.style.display = "inline-block";
    alertDiv.style.backgroundColor = "rgba(5,5,5,0.4)";
    alertDiv.style.borderRadius = "50px";
    alertDiv.style.width = "500px";
    alertDiv.style.height = "80px";
    alertDiv.style.margin = "10px";
    alertDiv.style.maxWidth = "500px"
    alertDiv.style.animationName = "alertboxin"
    alertDiv.style.animationDuration = "250ms"

    alertImg.src = "assets/info2.png";
    alertImg.style.display = "inline";
    alertImg.style.width = "60px";
    alertImg.style.height = "60px";
    alertImg.style.float = "left";
    alertImg.style.padding = "10px";
    alertImg.style.borderRadius = "9999px";

    alertText.textContent = text;
    alertText.style.display = "inline";
    alertText.style.fontSize = "30px";

    alertDiv.classList.add("alertDiv-1")
    alertText.classList.add("alertText-1")
    alertImg.classList.add("alertImg-1")


    if (type == "check") {
        alertImg.src = "assets/check.gif";
    } else if (type == "info") {
        alertImg.src = "assets/info2.png";
    } else {
        alertImg.src = "assets/error.png";
    }

    setTimeout(() => {
        alertDiv.style.animationName = "alertboxout";
    }, 2700);

    alertDiv.addEventListener("animationend", (event) => {
        if (event.animationName === "alertboxout") {
            alertDiv.remove();
        }
    });
}