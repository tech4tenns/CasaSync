/* =====================================================
   CASASYNC — SISTEMA DE XP UNIVERSAL
   Inclua em TODAS as páginas, antes do script da página:
   <script src="xp.js"></script>
   ===================================================== */

const CasaSyncXP = (function () {

    const CHAVE_XP = "casasyncXP";
    const CHAVE_TAREFAS = "casasyncTarefasConcluidas";

    /*
     * XP necessário para ALCANÇAR cada nível.
     * Posição no array = número do nível.
     * Ex.: 0 XP = nível 0 | 50 XP = nível 1 | 100 XP = nível 2 ...
     * Para mudar a dificuldade, edite só esta lista.
     */
    const LIMITES = [0, 50, 100, 200, 350, 500, 700, 1000, 1500, 2000];


    /* ---------- XP ---------- */

    function lerXP() {
        const valor = parseInt(localStorage.getItem(CHAVE_XP), 10);
        return isNaN(valor) || valor < 0 ? 0 : valor;
    }

    function nivelDe(xp) {
        let nivel = 0;
        for (let i = 0; i < LIMITES.length; i++) {
            if (xp >= LIMITES[i]) nivel = i;
        }
        return nivel;
    }

    /* Tudo que as telas precisam saber sobre o XP atual */
    function info(xp) {
        if (xp === undefined) xp = lerXP();

        const nivel = nivelDe(xp);
        const maximo = nivel >= LIMITES.length - 1;
        const inicio = LIMITES[nivel];
        const fim = maximo ? inicio : LIMITES[nivel + 1];

        let porcentagem = maximo ? 100 : ((xp - inicio) / (fim - inicio)) * 100;
        porcentagem = Math.max(0, Math.min(100, porcentagem));

        return {
            xp: xp,
            nivel: nivel,
            proximoNivel: maximo ? nivel : nivel + 1,
            maximo: maximo,
            inicio: inicio,
            fim: fim,
            faltam: maximo ? 0 : fim - xp,
            porcentagem: porcentagem
        };
    }

    /* Soma XP, salva e avisa as outras telas */
    function adicionar(quantidade) {
        quantidade = Number(quantidade) || 0;

        const antes = lerXP();
        const depois = Math.max(0, antes + quantidade);

        localStorage.setItem(CHAVE_XP, String(depois));

        /* "storage" só dispara em OUTRAS abas; este evento cobre a aba atual */
        window.dispatchEvent(new CustomEvent("casasync:xp", { detail: { xp: depois } }));

        const nivelAntes = nivelDe(antes);
        const nivelDepois = nivelDe(depois);

        return {
            xpAntes: antes,
            xpDepois: depois,
            nivelAntes: nivelAntes,
            nivelDepois: nivelDepois,
            subiuDeNivel: nivelDepois > nivelAntes
        };
    }


    /* ---------- TAREFAS CONCLUÍDAS (evita ganhar XP duas vezes) ---------- */

    function listaTarefas() {
        try {
            const lista = JSON.parse(localStorage.getItem(CHAVE_TAREFAS));
            return Array.isArray(lista) ? lista : [];
        } catch (erro) {
            return [];
        }
    }

    function tarefaConcluida(id) {
        return listaTarefas().indexOf(id) !== -1;
    }

    function marcarTarefaConcluida(id) {
        const lista = listaTarefas();
        if (lista.indexOf(id) === -1) {
            lista.push(id);
            localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(lista));
        }
    }


    /* ---------- ATUALIZAÇÃO AUTOMÁTICA ENTRE ABAS ---------- */

    /* Executa "funcao" sempre que o XP mudar (nesta aba ou em outra) */
    function aoMudar(funcao) {
        window.addEventListener("casasync:xp", funcao);
        window.addEventListener("storage", function (evento) {
            if (evento.key === CHAVE_XP) funcao();
        });
    }


    /* ---------- AVISO NA TELA ---------- */

    function mostrarAviso(texto) {
        const aviso = document.createElement("div");
        aviso.textContent = texto;
        aviso.style.cssText =
            "position:fixed;left:50%;bottom:30px;transform:translateX(-50%);" +
            "background:#225a9e;color:#fff;padding:14px 24px;border-radius:14px;" +
            "font:bold 16px Arial,sans-serif;box-shadow:0 8px 25px rgba(0,0,0,.3);" +
            "z-index:99999;transition:opacity .4s;text-align:center;max-width:90%;";
        document.body.appendChild(aviso);

        setTimeout(function () { aviso.style.opacity = "0"; }, 3000);
        setTimeout(function () { aviso.remove(); }, 3500);
    }


    return {
        lerXP: lerXP,
        nivelDe: nivelDe,
        info: info,
        adicionar: adicionar,
        tarefaConcluida: tarefaConcluida,
        marcarTarefaConcluida: marcarTarefaConcluida,
        aoMudar: aoMudar,
        mostrarAviso: mostrarAviso
    };

})();
