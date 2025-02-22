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
                next()

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


    // Positioning styles (add these)
    alertDiv.style.position = "fixed";
    alertDiv.style.top = "20px";
    alertDiv.style.left = "50%";
    alertDiv.style.transform = "translateX(-50%)";
    alertDiv.style.margin = "0";
    alertDiv.style.zIndex = "1000";

    // Add these transition properties
    alertDiv.style.transition = "opacity 250ms, transform 250ms";
    alertDiv.style.opacity = "0";

    // Remove these animation properties from original code:
    // alertDiv.style.animationName = "alertboxin"
    // alertDiv.style.animationDuration = "250ms"

    // Trigger reflow and animate in
    void alertDiv.offsetWidth; // Force reflow
    alertDiv.style.opacity = "1";

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

     // Modify the timeout to match new transition
     setTimeout(() => {
        alertDiv.style.opacity = "0";
    }, 2500);

    alertDiv.addEventListener("transitionend", (event) => {
        if (event.propertyName === "opacity" && alertDiv.style.opacity === "0") {
            alertDiv.remove();
        }
    });
}

function next() {
    const loading = document.createElement('div');
    
    // Initial styles
    loading.style.position = "fixed";
    loading.style.top = "0";
    loading.style.left = "0";
    loading.style.width = "100vw";
    loading.style.height = "100vh";
    loading.style.backgroundColor = "black";
    loading.style.opacity = "0";
    loading.style.transition = "opacity 1s ease-in-out";
    loading.style.zIndex = "9999";

    document.body.appendChild(loading);

    requestAnimationFrame(() => {
        loading.style.opacity = "1";
        
        setTimeout(() => {
            // Remove gradient and set new background
            document.body.style.background = "#002850"; // This replaces the gradient
            document.body.style.backgroundAttachment = "fixed"; // Reset attachment

            // Fade out the overlay to reveal new background
            loading.style.opacity = "0";

            // Remove overlay after fade-out
            loading.addEventListener('transitionend', () => {
                loading.remove();
                loadMenu();
            });
        }, 1000);
    });

    const main = document.getElementById('main');
    main.remove();
}


function loadMenu() {
    const nav = document.createElement('nav');
    const header = document.createElement('header');
    const profileImg = document.createElement('img');
    const menuImg = document.createElement('img');
    const title = document.createElement('p');

    profileImg.src = "assets/profile2.png";
    menuImg.src = "assets/menu.png";

    // Assign classes
    header.classList.add("header-1");
    profileImg.classList.add("profileImg-1");
    title.classList.add('title-2');
    menuImg.classList.add("menuImg-1"); // New class for menuImg

    // Append elements in order
    document.body.appendChild(header);
    header.appendChild(menuImg); // Menu image first (left side)
    header.appendChild(title);
    header.appendChild(profileImg); // Profile image last (right side)

    title.innerText = "asd";
}
