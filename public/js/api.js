const URL = "http://localhost:3000";

async function requisitar(caminho, opcoes) {
    const resposta = await fetch(`${URL}${caminho}`, opcoes);

    if (!resposta.ok) {
        throw new Error(`Falha na requisição ${caminho}: ${resposta.status}`);
    }

    return resposta;
}

async function getParticipantesRoca() {
    const resposta = await requisitar("/participantes?naRoca=true");
    return await resposta.json();
}

async function getDemaisParticipantes() {
    const resposta = await requisitar("/participantes?naRoca=false");
    return await resposta.json();
}

async function getVotos() {
    const resposta = await requisitar("/votos");
    return await resposta.json();
}

async function registrarVoto(participanteId) {
    const voto = {
        participanteId: participanteId,
        data: new Date().toISOString()
    };

    const resposta = await requisitar("/votos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voto)
    });

    return await resposta.json();
}

async function apagarVotos() {
    const votos = await getVotos();

    for (const voto of votos) {
        await requisitar(`/votos/${voto.id}`, { method: "DELETE" });
    }
}

function calcularResultado(participantes, votos) {
    const ranking = participantes.map(participante => {
        const quantidade = votos.filter(voto => String(voto.participanteId) === String(participante.id)).length;
        const percentual = votos.length > 0 ? (quantidade * 100) / votos.length : 0;

        return { ...participante, quantidade, percentual };
    });

    ranking.sort((a, b) => b.quantidade - a.quantidade);

    return ranking;
}

function mostrarErro(elemento) {
    elemento.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Não foi possível falar com o JSON Server. Confira se ele está rodando com <strong>npm start</strong> e abra a página em http://localhost:3000/.
        </div>
    `;
}
