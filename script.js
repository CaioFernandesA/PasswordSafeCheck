document.getElementById('checkButton').addEventListener('click', checkPassword);
document.getElementById('languageButton').addEventListener('click', toggleLanguage);

async function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const resultDiv = document.getElementById('result');
    const breachesListDiv = document.getElementById('breachesList');

    if (!password) {
        resultDiv.textContent = language === 'en' ? "Please enter a password." : "Por favor, insira uma senha.";
        resultDiv.className = "";
        breachesListDiv.innerHTML = ""; // Limpa a lista
        return;
    }

    const sha1 = CryptoJS.SHA1(password);
    const hash = sha1.toString(CryptoJS.enc.Hex).toUpperCase();
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();
        const breaches = data.split('\n');

        let found = false;
        let breachesFound = [];

        for (let breach of breaches) {
            const [hashSuffix, count] = breach.split(':');
            if (hashSuffix === suffix) {
                resultDiv.textContent = language === 'en' ?
                    `This password has been found in ${count} data breaches. It's unsafe to use!` :
                    `Esta senha foi encontrada em ${count} vazamentos de dados. Não é seguro usá-la!`;
                resultDiv.className = "unsafe";
                found = true;
                breachesFound.push(`Hash Suffix: ${hashSuffix}, Count: ${count}`);
            }
        }

        if (!found) {
            resultDiv.textContent = language === 'en' ?
                "Good news! This password hasn't been found in any known data breaches." :
                "Boa notícia! Esta senha não foi encontrada em nenhum vazamento de dados conhecido.";
            resultDiv.className = "safe";
            breachesListDiv.innerHTML = ""; // Limpa a lista caso não encontre
        } else {
            breachesListDiv.innerHTML = "<strong>" + (language === 'en' ? "Found in:" : "Encontrada em:") + "</strong><br>" + breachesFound.join("<br>");
        }

    } catch (error) {
        resultDiv.textContent = language === 'en' ? 
            "An error occurred while checking the password. Please try again later." :
            "Ocorreu um erro ao verificar a senha. Por favor, tente novamente mais tarde.";
        resultDiv.className = "";
        breachesListDiv.innerHTML = ""; // Limpa a lista em caso de erro
    }
}

// Alternância de idioma
let language = 'en'; // Idioma padrão é inglês

function toggleLanguage() {
    language = (language === 'en') ? 'pt' : 'en'; // Alterna entre 'en' e 'pt'
    document.getElementById('title').textContent = language === 'en' ? 'Password Safety Checker' : 'Verificador de Segurança de Senha';
    document.getElementById('passwordInput').placeholder = language === 'en' ? 'Enter your password' : 'Digite sua senha';
    document.getElementById('checkButton').textContent = language === 'en' ? 'Check Password' : 'Verificar Senha';
    document.getElementById('tipsTitle').textContent = language === 'en' ? 'Tips for a Strong Password:' : 'Dicas para uma Senha Forte:';
    document.getElementById('tipsList').innerHTML = language === 'en' ? 
        '<li>Use at least 12 characters</li><li>Include uppercase and lowercase letters</li><li>Use numbers and special characters</li><li>Avoid common words or phrases</li><li>Don\'t use personal information</li><li>Use a unique password for each account</li>' :
        '<li>Use pelo menos 12 caracteres</li><li>Inclua letras maiúsculas e minúsculas</li><li>Use números e caracteres especiais</li><li>Evite palavras comuns ou frases</li><li>Não use informações pessoais</li><li>Use uma senha única para cada conta</li>';

    const languageButton = document.getElementById('languageButton');
    languageButton.classList.toggle('active');
}
