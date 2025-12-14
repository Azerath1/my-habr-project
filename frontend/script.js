const API_URL = "http://localhost:8000";

// Проверка авторизации (токен в localStorage)
function checkAuth() {
  const token = localStorage.getItem("token");
  const logoutBtn = document.getElementById("logout");
  const createBtn = document.getElementById("createArticleBtn");

  if (token) {
    if (logoutBtn) logoutBtn.style.display = "inline";
    if (createBtn) createBtn.style.display = "inline";
  } else {
    if (logoutBtn) logoutBtn.style.display = "none";
    if (createBtn) createBtn.style.display = "none";
    if (window.location.pathname.endsWith("create-article.html")) {
      alert("Вы не авторизованы. Перенаправляем на вход.");
      window.location.href = "login.html";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.reload();
    });
  }
}

// Регистрация
async function registerUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error(await response.text());
    alert("Регистрация успешна! Теперь войдите.");
    window.location.href = "login.html";
  } catch (error) {
    alert("Ошибка регистрации: " + error.message);
  }
}

// Логин
async function loginUser(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${username}&password=${password}`,
    });
    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    alert("Вход успешен!");
    window.location.href = "articles.html";
  } catch (error) {
    alert("Ошибка входа: " + error.message);
  }
}

// Загрузка списка статей
async function loadArticles() {
  try {
    const response = await fetch(`${API_URL}/articles`);
    if (!response.ok) throw new Error(await response.text());
    const articles = await response.json();
    const list = document.getElementById("articlesList");
    list.innerHTML = "";
    articles.forEach((article) => {
      const div = document.createElement("div");
      div.classList.add("article");
      div.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.content.substring(0, 200)}...</p>
                <p>Автор: ${article.author_name} | Создано: ${new Date(
        article.created_at
      ).toLocaleString()}</p>
            `;
      list.appendChild(div);
    });
  } catch (error) {
    alert("Ошибка загрузки статей: " + error.message);
  }
}

// Создание статьи
async function createArticle(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) throw new Error(await response.text());
    alert("Статья создана!");
    window.location.href = "articles.html";
  } catch (error) {
    alert("Ошибка создания статьи: " + error.message);
  }
}
