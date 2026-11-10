async function carregarHome() {
    const container = document.getElementById("participantesRoca");

    try {
        const participantes = await getParticipantesRoca();

        container.innerHTML = participantes.map(p => `
            <div class="d-flex align-items-center gap-2 bg-light text-dark rounded p-2 pe-3">
                <img src="${p.foto}" alt="${p.nome}" class="rounded-circle foto-mini">
                <span class="fw-bold">${p.nome}</span>
            </div>
        `).join("");
    } catch (erro) {
        mostrarErro(container);
    }
}

carregarHome();
