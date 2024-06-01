document.addEventListener("DOMContentLoaded", () => {
    // Seleciona o campo de CEP e os campos de endereço
    const cepInput = document.getElementById("cep");
    const enderecoInput = document.getElementById("endereco");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");

    // Adiciona um ouvinte de eventos para quando o usuário sair do campo de CEP
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                if (response.data.erro) {
                    alert("CEP não encontrado.");
                } else {
                    enderecoInput.value = response.data.logradouro;
                    bairroInput.value = response.data.bairro;
                    cidadeInput.value = response.data.localidade;
                    estadoInput.value = response.data.uf;
                }
            } catch (error) {
                alert("Erro ao buscar o CEP.");
            }
        } else {
            alert("CEP inválido.");
        }
    });
});
