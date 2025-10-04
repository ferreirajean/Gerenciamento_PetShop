document.addEventListener("DOMContentLoaded", () => {
    const apresentacao = document.getElementById("apresentacao");
    const cadastro = document.getElementById("cadastro");
    const entrarBtn = document.getElementById("entrarBtn");

    entrarBtn.addEventListener("click", () => {
        apresentacao.classList.add("hidden");
        cadastro.classList.remove("hidden");
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".navbar a");
    const sections = document.querySelectorAll("section");

    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById("apresentacao").classList.remove("hidden");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            sections.forEach(sec => sec.classList.add("hidden"));

            const target = link.getAttribute("data-section");
            document.getElementById(target).classList.remove("hidden");
        });
    });

    links[0].classList.add("active");
});

document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());


    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'red';
        } else {
            field.style.borderColor = '';
        }
    });

    if (!isValid) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            exibirMensagem(result.message, 'sucesso');
            form.reset();
        } else {
            exibirMensagem(result.message || 'Ocorreu um erro no servidor.', 'erro');
        }

    } catch (error) {
        console.error('Erro ao conectar com o servidor:', error);
        exibirMensagem('Não foi possível conectar ao servidor. Tente novamente mais tarde.', 'erro');
    }
});

function exibirMensagem(texto, tipo) {
    const elementoMensagem = document.getElementById('mensagem');
    elementoMensagem.textContent = texto;
    elementoMensagem.className = tipo;

    elementoMensagem.classList.remove('hidden');

    setTimeout(() => {
        elementoMensagem.classList.add('hidden');
    }, 5000);
}