function formatarPercentual(valor) {
    return valor.toFixed(1).replace(".", ",");
}

async function carregarResultado() {
    const container = document.getElementById("resultado");
    const botaoZerar = document.getElementById("btnZerar");

    try {
        const votos = await getVotos();

        document.getElementById("totalVotos").textContent = votos.length;
        document.getElementById("rotuloTotal").textContent =
            votos.length === 1 ? "voto computado" : "votos computados";

        if (votos.length === 0) {
            botaoZerar.classList.add("d-none");
            container.innerHTML = `
                <div class="card card-body text-center">
                    <p>Nenhum voto ainda. Escolha quem sai da roça para ver a parcial.</p>
                    <div><a href="votacao.html" class="btn btn-danger">Ir para a votação</a></div>
                </div>
            `;
            return;
        }

        const participantes = await getParticipantesRoca();
        const ranking = calcularResultado(participantes, votos);

        container.innerHTML = ranking.map((p, indice) => `
            <div class="card mb-3">
                <div class="card-body d-flex align-items-center gap-3">
                    <img src="${p.foto}" class="foto-resultado rounded" alt="${p.nome}">
                    <div class="flex-grow-1">
                        <h2 class="h5 text-dark">
                            ${p.nome}
                            ${indice === 0 ? '<span class="badge bg-danger">Sairia hoje</span>' : ""}
                        </h2>
                        <div class="progress">
                            <div class="progress-bar ${indice === 0 ? "bg-danger" : "bg-secondary"}"
                                 style="width: ${p.percentual}%"></div>
                        </div>
                        <small>${formatarPercentual(p.percentual)}% (${p.quantidade} ${p.quantidade === 1 ? "voto" : "votos"})</small>
                    </div>
                </div>
            </div>
        `).join("");

        botaoZerar.classList.remove("d-none");
    } catch (erro) {
        botaoZerar.classList.add("d-none");
        mostrarErro(container);
    }
}

document.getElementById("btnConfirmarZerar").addEventListener("click", async () => {
    await apagarVotos();
    bootstrap.Modal.getInstance(document.getElementById("modalZerar")).hide();
    carregarResultado();
});

carregarResultado();
