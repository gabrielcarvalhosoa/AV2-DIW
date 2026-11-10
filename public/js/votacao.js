async function carregarParticipantes() {
    const containerRoca = document.getElementById("cardsRoca");
    const containerPeoes = document.getElementById("cardsPeoes");

    try {
        const roca = await getParticipantesRoca();
        const peoes = await getDemaisParticipantes();

        containerRoca.innerHTML = roca.map(p => `
            <div class="col">
                <div class="card h-100">
                    <img src="${p.foto}" class="card-img-top" alt="${p.nome}">
                    <div class="card-body text-center">
                        <span class="badge bg-danger mb-2">Na roça</span>
                        <h2 class="card-title h5 text-dark">${p.nome}</h2>
                        <button type="button" class="btn btn-danger w-100" data-id="${p.id}" data-nome="${p.nome}">
                            Votar para eliminar
                        </button>
                    </div>
                </div>
            </div>
        `).join("");

        containerPeoes.innerHTML = peoes.map(p => `
            <div class="col">
                <div class="card h-100">
                    <img src="${p.foto}" class="card-img-top" alt="${p.nome}">
                    <div class="card-body p-1 text-center small">${p.nome}</div>
                </div>
            </div>
        `).join("");
    } catch (erro) {
        mostrarErro(containerRoca);
    }
}

async function votar(id, nome) {
    const mensagem = document.getElementById("mensagem");

    try {
        await registrarVoto(id);
        const votos = await getVotos();
        const vezes = votos.length === 1 ? "1 vez" : `${votos.length} vezes`;

        mensagem.innerHTML = `
            <div class="alert alert-success" role="alert">
                Voto registrado para eliminar <strong>${nome}</strong>. Você já votou ${vezes}.
                <a href="resultado.html" class="alert-link">Ver resultado</a>
            </div>
        `;
    } catch (erro) {
        mostrarErro(mensagem);
    }
}

document.getElementById("cardsRoca").addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-id]");

    if (botao) {
        votar(botao.dataset.id, botao.dataset.nome);
    }
});

carregarParticipantes();
