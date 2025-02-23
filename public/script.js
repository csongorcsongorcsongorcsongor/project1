function Register() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const regreq = new XMLHttpRequest();
    regreq.open("post", '/register');
    regreq.setRequestHeader('Content-Type', 'application/json');
    regreq.send(JSON.stringify({
        'regName': username,
        'regPass': password
    }));
    regreq.onreadystatechange = () => {
        if (regreq.readyState == 4) {
            const result = JSON.parse(regreq.response);
            console.log(result.message);
            alert(result.message);
        }
    }
}

function Login() {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    const LoginRequest = new XMLHttpRequest();

    LoginRequest.open("post", '/login');
    LoginRequest.setRequestHeader('Content-Type', 'application/json');
    LoginRequest.send(JSON.stringify({
        'loginName': username,
        'loginPass': password
    }));
    LoginRequest.onreadystatechange = () => {
        if (LoginRequest.readyState == 4) {
            if (LoginRequest.status == 200) {
                const result = JSON.parse(LoginRequest.response);
                console.log(result.response);
                alert("Sikeres bejelentkezés");
                next();
            } else {
                alert("Sikertelen bejelentkezés");
            }
        }
    }
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
    loading.style.zIndex = "99999";

    document.body.appendChild(loading);

    requestAnimationFrame(() => {
        loading.style.opacity = "1";
        
        setTimeout(() => {
            document.body.style.background = "#002850";
            document.body.style.backgroundAttachment = "fixed";
            loadMenu();
            
            requestAnimationFrame(() => {
                loading.style.transition = "opacity 2s ease-in-out";
                loading.style.opacity = "0";
            });

            // Ensure removal even if transitionend doesn't fire
            setTimeout(() => {
                if (loading.parentNode) {
                    loading.remove();
                }
            }, 2500); // Slightly longer than the transition time
        }, 1000);
    });

    const main = document.getElementById('main');
    if (main) main.remove();
}


function loadMenu() {
    const nav = document.createElement('nav');
    const header = document.createElement('header');
    const profileImg = document.createElement('img');
    const menuImg = document.createElement('img');
    const title = document.createElement('p');

    profileImg.src = "assets/profile2.png";
    menuImg.src = "assets/menu.png";

    header.classList.add("header-1");
    profileImg.classList.add("profileImg-1");
    title.classList.add('title-2');
    menuImg.classList.add("menuImg-1");

    document.body.appendChild(header);
    header.appendChild(menuImg);
    header.appendChild(title);
    header.appendChild(profileImg);

    title.innerText = "asd";
}
