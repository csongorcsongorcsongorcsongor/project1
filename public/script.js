function Register() {

    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    const amount = document.getElementById('amountInput').value;

    if (username.length < 3) {
        showalertshit("Túl rövid felhasználó név");
        return;
    } else if (password.length < 8) {
        showalertshit("Tól rövid jelszó");
        return;
    } else if (amount.length < 1) {
        showalertshit("Túl kevés összeg");
        return;
    }
    const regreq = new XMLHttpRequest();
    regreq.open("post", '/register');
    regreq.setRequestHeader('Content-Type', 'application/json');
    regreq.send(JSON.stringify({
        'registerUsername': username,
        'registerPassword': password,
        'regAmount': amount

    }));
    regreq.onreadystatechange = () => {
        if (regreq.readyState == 4) {
            const result = JSON.parse(regreq.response);
            console.log(result.message);
            if (regreq.status == 403) {
                showalertshit(result.message);
            } else {
                showalertshit(result.message, "y")
                gotologin()
            }
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
        'loginUsername': username,
        'loginPassword': password
    }));
    LoginRequest.onreadystatechange = () => {
        if (LoginRequest.readyState == 4) {
            if (LoginRequest.status == 200) {
                const result = JSON.parse(LoginRequest.response);
                console.log(result.response);
                sessionStorage.setItem('token', result.token)
                console.log('Sikeres token mentés')
                next();
            } else {
                showalertshit("Hibás jelszó/felhasználónév")
            }
        }
    }
}

function next() {
    const loading = document.createElement('div');

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

            setTimeout(() => {
                if (loading.parentNode) {
                    loading.remove();
                }
            }, 2500);
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

    const usernametext = document.createElement('p')


    profileImg.src = "assets/profile2.png";
    menuImg.src = "assets/menu.png";

    profileImg.onclick = logout; 


    header.classList.add("header-1");
    profileImg.classList.add("profileImg-1");
    title.classList.add('title-2');
    menuImg.classList.add("menuImg-1");
    usernametext.classList.add("menuUser-1")

    document.body.appendChild(header);
    header.appendChild(menuImg);
    header.appendChild(title);
    header.appendChild(usernametext)
    header.appendChild(profileImg);

    title.innerText = "Roulette";
    usernametext.innerHTML = "név"

    const datadiv = document.createElement('div')
    const divtitle = document.createElement('p')
    const osszeglabel = document.createElement('label')
    const osszeg = document.createElement('p')


    const topup = document.createElement('label')
    const topupinput = document.createElement('input')
    const topupbtn = document.createElement('button')

    topup.innerText = "Összeg feltöltés"
    topup.for = "topupinput"
    topupinput.type = "number"
    topupinput.placeholder = "0"
    topupbtn.innerText = "Feltöltés"

    datadiv.classList.add("datadiv-1")
    osszeglabel.classList.add('osszeglabel-1')
    divtitle.classList.add('divtitle-1')
    topup.classList.add('topuptext-1')
    topupinput.classList.add('input-2')
    topupbtn.classList.add('button-1')

    topupbtn.onclick = save;

    document.body.appendChild(datadiv)
    datadiv.appendChild(divtitle)
    datadiv.appendChild(osszeglabel)
    datadiv.appendChild(osszeg)

    datadiv.appendChild(topup)
    datadiv.appendChild(topupinput)
    datadiv.appendChild(topupbtn)

    osszeglabel.innerText = "Összeg: "
    divtitle.innerText = "Adatok"

    Profil()





}


function showalertshit(text, type) {
    const alerttext = document.getElementById('alert')

    if (type == "y") {
        alerttext.style.color = "rgba(0,191,0,1)"
    } else {
        alerttext.style.color = "rgba(237,67,55,1)"

    }

    alerttext.style.display = "inline"
    alerttext.innerText = text
}

const registerButton = document.getElementById('registerButton')
const loginButton = document.getElementById('loginButton')
const amountInput = document.getElementById('amountInput')

amountInput.style.display = "none"
registerButton.style.display = "none"


const registertext = document.getElementById('donthaveanaccountyet')
registertext.addEventListener('click', function () {
    gotoregister()

})


function gotoregister() {
    document.getElementById('alert').value = '';

    registertext.style.display = "none"
    registerButton.style.display = "inline"
    loginButton.style.display = "none"
    amountInput.style.display = "block"
}

function gotologin() {
    document.getElementById('usernameInput').value = '';
    document.getElementById('passwordInput').value = '';
    document.getElementById('amountInput').value = '';

    registertext.style.display = "block";
    registerButton.style.display = "none";
    loginButton.style.display = "inline";
    amountInput.style.display = "none";
}

function Profil() {
    const profileReq = new XMLHttpRequest();
    profileReq.open('get', '/profil');
    profileReq.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
    profileReq.send();
    profileReq.onreadystatechange = () => {
        if (profileReq.readyState == 4) {
            const result = JSON.parse(profileReq.response);
            const usernametext = document.querySelector('.menuUser-1');
            const osszeglabel = document.querySelector('.osszeglabel-1');

            // Display "Admin" instead of "admin"
            usernametext.innerHTML = result.username === 'admin' ? 'Admin' : result.username;
            osszeglabel.innerText = "Összeg: " + result.osszeg;

            // Fetch all users if admin
            if (result.username === 'admin') {
                const allUsersReq = new XMLHttpRequest();
                allUsersReq.open('get', '/allusers');
                allUsersReq.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));
                allUsersReq.send();
                allUsersReq.onreadystatechange = () => {
                    if (allUsersReq.readyState === 4 && allUsersReq.status === 200) {
                        const users = JSON.parse(allUsersReq.response);
                        const userListDiv = document.createElement('div');
                        userListDiv.classList.add('user-list');

                        const title = document.createElement('h3');
                        title.textContent = 'Összes felhasználó';
                        userListDiv.appendChild(title);

                        users.forEach(user => {
                            const userDiv = document.createElement('div');
                            userDiv.classList.add('user-item');

                            const userText = document.createElement('span');
                            userText.textContent = `${user.username}, ${user.osszeg}`;

                            const deleteBtn = document.createElement('img');
                            deleteBtn.src = "assets/trash.png";
                            deleteBtn.classList.add('delete-btn-img', 'profileImg-1'); // Reuse profile image styles
                            deleteBtn.title = "Felhasználó törlése";
                            deleteBtn.onclick = () => deleteUser(user.username);

                            userDiv.appendChild(userText);
                            userDiv.appendChild(deleteBtn);
                            userListDiv.appendChild(userDiv);
                        });

                        const datadiv = document.querySelector('.datadiv-1');
                        datadiv.insertBefore(userListDiv, datadiv.children[3]);
                    }
                };
            }
        }
    };
}


function save() {
    const topupinput = document.querySelector('.input-2');
    const usernametext = document.querySelector('.menuUser-1');

    const savereq = new XMLHttpRequest();
    savereq.open('put', '/save');
    savereq.setRequestHeader('Content-Type', 'application/json');

    savereq.send(JSON.stringify({
        'username': usernametext.textContent,
        'osszeg': topupinput.value
    }));

    savereq.onreadystatechange = () => {
        if (savereq.readyState == 4) {
            if (savereq.status == 200) {
                const result = JSON.parse(savereq.response);
                console.log(result.message);

                topupinput.value = "";

                Profil();
            } else {
                console.error('Hiba történt a feltöltés közben.');
            }
        }
    };
}


document.getElementById('passwordInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        Login();
    }
});

function deleteUser(username) {
    if (!confirm(`Biztosan törölni szeretnéd ${username} felhasználót?`)) return;

    const deleteReq = new XMLHttpRequest();
    deleteReq.open('delete', '/deleteUser');
    deleteReq.setRequestHeader('Content-Type', 'application/json');
    deleteReq.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.getItem('token'));

    deleteReq.send(JSON.stringify({
        username
    }));

    deleteReq.onreadystatechange = () => {
        if (deleteReq.readyState === 4 && deleteReq.status === 200) {
            // Refresh user list after deletion
            document.querySelector('.user-list').remove();
            Profil();
        }
    };
}

function logout() {
    sessionStorage.clear();
    window.location.reload();
}