// Função que Limpa o campo de pesquisa
function resetForm() {
    // Limpar o select de opções
    const opcaoSelect = document.getElementById('opcaoSelect');
    opcaoSelect.selectedIndex = 0; // Seleciona a primeira opção (nada)

    // Limpar o select sortido
    const selectsortido = document.getElementById('sortidosselect');
    selectsortido.classList.add('hidden');
    selectsortido.innerHTML = ''; // Remove todas as opções

    // Limpar o campo de texto
    const textarea = document.querySelector('.cht_erro_form_txt');
    textarea.value = '';

    // Desabilitar o botão de enviar
    const cht_erro_form_btn = document.querySelector('.cht_erro_form_btn');
    cht_erro_form_btn.disabled = true;

    // Limpar o título do select
    const opcaoLabel = document.getElementById('opcaoLabel');
    opcaoLabel.textContent = 'Comentário';

    // Remover elementos dinâmicos
    const dynamicContent = document.getElementById('dynamicContent');
    if (dynamicContent) {
        dynamicContent.remove();
    }

    // Remover input termo
    const inputTermo = document.querySelector('.cht_err_form_termo');
    if (inputTermo) {
        inputTermo.remove();
    }

    //Desabilita, por precaução todos os valores do select
    const opcaoSelectOptions = document.querySelectorAll('#opcaoSelect option');
    opcaoSelectOptions.forEach(option => {
        option.classList.remove('hidden-option');
        option.disabled = false;
    });

    // Verifica novamente:
    console.log("reset,passa aqui");
    enableOptions();
}


//Função que ajudat e verifica se existem quais opções colocar no select. Exemplo, pode ser que um conceito não tenha, por exemplo, um público-alvo
function enableOptions() {
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    console.log("entrooou");
    searchButton.addEventListener('click', async () => {
        console.log("entrooou2");
        const searchInput = document.getElementById('pesquisar');
        const input = searchInput.value.trim();
        resetForm(); // Limpa o formulário
        if (input) {
                console.log("entrooou3");
                try {
                    const response = await fetch(`/search?q=${encodeURIComponent(input)}`);
                    const results = await response.json();
                    const opcaoSelect = document.getElementById('opcaoSelect');
                    const opcaoLabel = document.getElementById('opcaoLabel');
                    const selectsortido = document.getElementById('sortidosselect');
                    const chat_erro_form = document.querySelector('.cht_inc');
                    

                    results.forEach(result => {

                        // Criação de um imput para colocar o nome do termo que será denunciado
                        function createInputTermo() {
                            const inputTermo = document.createElement('input');
                            inputTermo.value = input; // Define o valor do campo
                            inputTermo.name = 'termo';
                            inputTermo.readOnly = true; // Define o campo como somente leitura
                            inputTermo.classList.add('cht_err_form_termo'); // Adiciona uma classe ao campo
                            chat_erro_form.prepend(inputTermo);
                        }

                        createInputTermo();

                        //Função criar um p invisível com o ID
                        function ceratepid(){
                            const pid = document.createElement('p');
                            const idterm= result.ID;
                            pid.textContent = idterm;
                            pid.classList.add('id-termo');
                            chat_erro_form.appendChild(pid);
                            console.log("OOOOOOOOOOOK",idterm);
                        }

                        ceratepid();

                        // Função para enviar os dados para o servidor
                    async function enviarDados() {
                        const opcaoselect = document.getElementById('opcaoSelect');
                        const opcao_selected2 = document.getElementById('sortidosselect');
                        const comentario = document.querySelector('.cht_erro_form_txt').value;
                        const fk_idtabfin = document.querySelector('.id-termo').textContent;
                        const tabfin_camp = document.querySelector('.cht_err_form_termo').value;
                        console.log("TabfinCAmp",tabfin_camp);
                        let opcao_select2 = null;
                        // Verifica se a caixa de comentário está vazia
                        if (!comentario) {
                        alert('Por favor, preencha o campo de comentário.');
                        return; // Impede o envio do formulário
                        }

                         // Verifica se o select sortido está visível e existe
                        if (opcao_selected2 && !opcao_selected2.classList.contains('hidden')) {
                            opcao_select2 = opcao_selected2.options[opcao_selected2.selectedIndex].text;
                        }

                        
                        const dados = {
                            comentario: comentario,
                            opcao_select: opcaoselect.value,
                            opcao_select2: opcao_select2,
                            fk_idtabfin: fk_idtabfin,
                            tabfin_camp: tabfin_camp
                        };
                        console.log("Dados:",dados);

                        try {
                            const response = await fetch('/api/enviar', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dados)
                            });

                            const result = await response.json();
                            if (result.success) {
                                alert(result.message);
                                resetForm();
                                const chat_erro_form = document.querySelector('.cht_erro_form');
                                chat_erro_form.classList.add('hidden');
                                const btnroxo = document.querySelector('.cnt_cht_erro');
                                btnroxo.classList.add('hidden');
                            } else {
                                alert('Erro ao enviar comentário.');
                            }
                        } catch (error) {
                            alert('Erro ao enviar comentário.');
                        }
                    }
                    // Adicionar evento ao botão de enviar
                    document.querySelector('.cht_erro_form_btn').addEventListener('click', enviarDados);

                        // Adicionar opções ao select de acordo com os resultados

                        if (!result.texto_definicao1 && !result.texto_definicao2 && !result.texto_definicao3){
                            opcaoSelect.options[1].classList.add('hidden-option'); // Oculta a opção
                            opcaoSelect.options[1].disabled = true; // Desabilita a opção
                        }

                        if(!result.texto_tratamento){
                            opcaoSelect.options[2].classList.add('hidden-option'); // Oculta a opção
                            opcaoSelect.options[2].disabled = true; // Desabilita a opção
                        }

                        if(!result.texto_prevencao){
                            opcaoSelect.options[3].classList.add('hidden-option'); // Oculta a opção
                            opcaoSelect.options[3].disabled = true; // Desabilita a opção
                        }

                        if(!result.texto_publicoalvo){
                            opcaoSelect.options[4].classList.add('hidden-option'); // Oculta a opção
                            opcaoSelect.options[4].disabled = true; // Desabilita a opção
                        }

                        if(!result.paragrafo1 && !result.paragrafo2 && !result.paragrafo3){
                            opcaoSelect.options[5].classList.add('hidden-option'); // Oculta a opção
                            opcaoSelect.options[5].disabled = true; // Desabilita a opção
                        }

                        if(!result.video1 && !result.video2 && !result.video3){
                            opcaoSelect.options[6].classList.add('hidden-option'); // Oculta a opção
                            opcaoSelect.options[6].disabled = true; // Desabilita a opção
                        }

                        // Adcionarum campo select caso sejam selecionadas uma das opções: Vídeos, Conceitos e Carrossel
                        opcaoSelect.addEventListener('change', function() {
                        const selectedOption = opcaoSelect.options[opcaoSelect.selectedIndex].value;
                        opcaoLabel.textContent = opcaoSelect.options[opcaoSelect.selectedIndex].text;
                        console.log(selectedOption,"selectedOption");
                        if (selectedOption === 'vídeo'){
                            const VideoTitles = [];
                            // Remover opções anteriores
                            selectsortido.innerHTML = '';
                            if (result.video1){
                                VideoTitles.push(result.video1);
                                // Criação de uma opção de vídeo usando a tag option 
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option'); 
                                option.value = 'video1';
                                option.text = result.titulo_video1;   
                                selectsortido.appendChild(option);
                            }
                            if (result.video2){
                                VideoTitles.push(result.video2);
                                // Criação de uma opção de vídeo usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'video2';
                                option.text = result.titulo_video2;
                                selectsortido.appendChild(option);
                            }
                            if (result.video3){
                                VideoTitles.push(result.video3);
                                // Criação de uma opção de vídeo usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'video3';
                                option.text = result.titulo_video3;
                                selectsortido.appendChild(option);
                            }
                        }
                        if (selectedOption === 'conceito1'){
                            const ConceitoTitles = [];
                            // Remover opções anteriores
                            selectsortido.innerHTML = '';
                            if (result.texto_definicao1){
                                ConceitoTitles.push(result.texto_definicao1);
                                // Criação de uma opção de conceito usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'conceito1';
                                option.text = "SUS";
                                selectsortido.appendChild(option);
                            }
                            if (result.texto_definicao2){
                                ConceitoTitles.push(result.texto_definicao2);
                                // Criação de uma opção de conceito usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'conceito2';
                                option.text = "MedlinePlus";
                                selectsortido.appendChild(option);
                            }
                            if (result.texto_definicao3){
                                ConceitoTitles.push(result.texto_definicao3);
                                // Criação de uma opção de conceito usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'conceito3';
                                option.text = "Pydictionary com banco de dados da Wordnet";
                                selectsortido.appendChild(option);
                            }
                        }
                        if (selectedOption === 'Carrossel'){
                            const CarrosselTitles = [];
                            // Remover opções anteriores
                            selectsortido.innerHTML = '';
                            if (result.paragrafo1){
                                CarrosselTitles.push(result.paragrafo1);
                                // Criação de uma opção de carrossel usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'carrossel1';
                                option.text = result.fonte_link1;
                                selectsortido.appendChild(option);
                            }
                            if (result.paragrafo2){
                                CarrosselTitles.push(result.paragrafo2);
                                // Criação de uma opção de carrossel usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'carrossel2';
                                option.text = result.fonte_link2;
                                selectsortido.appendChild(option);
                            }
                            if (result.paragrafo3){
                                CarrosselTitles.push(result.paragrafo3);
                                // Criação de uma opção de carrossel usando a tag option
                                selectsortido.classList.remove('hidden');
                                const option = document.createElement('option');
                                option.value = 'carrossel3';
                                option.text = result.fonte_link3;
                                selectsortido.appendChild(option);
                            }
                        }

                        if (selectedOption === "tratamento" || selectedOption === "prevencao" || selectedOption === "publico-alvo" || selectedOption === "nada"){
                            selectsortido.classList.add('hidden');
                            // Remover opções anteriores
                            selectsortido.innerHTML = '';
                        }

                        // Se o nada for selecionado, o botão de enviar é desabilitado
                        if (selectedOption === "nada"){
                            const cht_erro_form_btn = document.querySelector('.cht_erro_form_btn');
                            cht_erro_form_btn.disabled = true;
                        } 
                        else {
                            const cht_erro_form_btn = document.querySelector('.cht_erro_form_btn');
                            cht_erro_form_btn.disabled = false;
                        }
                        });

                    });
                } 

                catch (error) {
                    console.error('Erro ao buscar resultados:', error);
                }
    }
    });
});
}

enableOptions();

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('pesquisar');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('results');
    const saibaMaisSlider = document.getElementById('saibaMaisSlider');
    const carousel360 = document.getElementById('carousel360');
    const suggestionsBox = document.getElementById('suggestions');
    const carouselContainer = document.querySelector('.carousel-container');
    const carousel360Container = document.querySelector('.carousel-360-container');
    const carousel360Title = document.getElementById('carousel360Title');
    const sts_ut_background = document.getElementById('sts_ut_background');
    const chat_erro_btn = document.querySelector('.cnt_cht_erro');
    const chat_erro_form = document.querySelector('.cht_erro_form');
    const chat_erro_form_btn = document.querySelector('.cht_err_btn');
    let currentSlide = 0;

    // Função para criar o carrossel de Saiba Mais
    function createCarousel(cards) {
        saibaMaisSlider.innerHTML = ''; // Limpa o conteúdo existente

        cards.forEach(card => {
            const cardTitle = card.title.length > 1800 ? `${card.title.slice(0, 1830)}... Acesse a informação completa no link abaixo: ` : card.title;
            saibaMaisSlider.insertAdjacentHTML('beforeend', `
                <div class="card_saibamais card">
                    <div class="card_txt">
                        <p class="chat_tipo_sm">Saiba mais:</p>
                        <p class="card_title">${cardTitle}</p>
                        <p class="chat_fonte_sm">Fonte: ${card.source}</p>
                        <a target="_blank" href="${card.link}"><button class="chat_button">Acesse</button></a>
                    </div>
                </div>
            `);
        });

        updateCarousel(); // Atualiza o carrossel após a criação
        carouselContainer.classList.remove('hidden'); // Torna o carrossel visível
    }


    // Função para criar o carrossel 360 graus
    function createCarousel360(images) {
        carousel360.innerHTML = ''; // Limpa o conteúdo existente

        // Adiciona as imagens ao carrossel
        images.forEach(img => {
            carousel360.insertAdjacentHTML('beforeend', `
                ${img} 
            `);
        });

        // Duplicar as imagens para criar efeito contínuo
        images.forEach(img => {
            carousel360.insertAdjacentHTML('beforeend', `
                ${img}
            `);
        });

        startCarousel360(); // Inicia o movimento automático do carrossel 360 graus
        carousel360Container.classList.remove('hidden'); // Torna o carrossel 360 graus visível
        carousel360Title.classList.remove('hidden'); // Torna o título do carrossel 360 graus visível
        sts_ut_background.classList.remove('hidden');
        chat_erro_btn.classList.remove('hidden');
    }

    // Quando o usuário clicar na caixa de erro, a caixa de erro será exibida
    chat_erro_btn.addEventListener('click', () => {
        chat_erro_form.classList.remove('hidden');
    });

    // Quando o usuário clicar no botão de fechar, a caixa de erro será fechada
    chat_erro_form_btn.addEventListener('click', () => {
        chat_erro_form.classList.add('hidden'); 
    });

    // Ajusta a navegação do carrossel
    function updateCarousel() {
        const slideWidth = saibaMaisSlider.children[0]?.clientWidth || 0;
        saibaMaisSlider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }

    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');

    nextBtn.addEventListener('click', () => {
        if (currentSlide < saibaMaisSlider.children.length - 1) {
            currentSlide++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });

    // Função para carregar os resultados da pesquisa
    searchButton.addEventListener('click', async () => {
        const input = searchInput.value.trim();
        resultsContainer.innerHTML = '';
        saibaMaisSlider.innerHTML = ''; // Limpa o carrossel existente
        carouselContainer.classList.add('hidden'); // Oculta o carrossel
        carousel360Container.classList.add('hidden'); // Oculta o carrossel 360 graus
        carousel360Title.classList.add('hidden'); // Oculta o título do carrossel 360 graus
        sts_ut_background.classList.add('hidden'); // Oculta o fundo do carrossel 360 graus

        if (input) {
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(input)}`);
                const results = await response.json();

                console.log('Search Results:', results);

                results.forEach(result => {
                    let resultHtml = '<div class="chat_cnt">';

                    // Conceito
                    if (result.texto_definicao1) {
                        resultHtml += `
                            <p class="chat_tipo">Conceito:</p>
                            <div class="chat_txt">
                                <p class="chat_texto">${result.texto_definicao1}</p>
                                <p class="chat_fonte">Fonte: ${result.fonte_definicao1}</p>
                                <p class="chat_fonte">${result.acesso_em}</p>`;
                        if (result.url_sus) {
                            resultHtml += `<a target="_blank" href="${result.url_sus}"><button class="chat_button">Acesse</button></a>`;
                        }
                        resultHtml += '</div>';
                    }

                    // Conceito dado por outra fonte
                    if (result.texto_definicao2) {
                        resultHtml += `
                            <p class="chat_tipo">Conceito:</p>
                            <div class="chat_txt">
                                <p class="chat_texto">${result.texto_definicao2}</p>
                                <p class="chat_fonte">Fonte: ${result.fonte_definicao2}</p>
                                <p class="chat_fonte">${result.acesso_em}</p>`;
                        if (result.url_med) {
                            resultHtml += `<a target="_blank" href="${result.url_med}"><button class="chat_button">Acesse</button></a>`;
                        }
                        resultHtml += '</div>';
                    }

                    // Outro conceito
                    if (result.texto_definicao3) {
                        resultHtml += `
                            <p class="chat_tipo">Conceito:</p>
                            <div class="chat_txt">
                                <p class="chat_texto">${result.texto_definicao3}</p>
                                <p class="chat_fonte">Fonte: ${result.fonte_definicao3}</p>
                                <p class="chat_fonte">${result.acesso_em}</p>
                            </div>`;
                    }

                    // Tratamento, prevenção e público-alvo
                    if (result.texto_tratamento || result.texto_prevencao || result.texto_publicoalvo) {
                        resultHtml += '<div class="chat_tppa">';

                        if (result.texto_tratamento) {
                            resultHtml += `
                                <div class="ttpa">
                                    <p class="chat_tipo">Tratamento:</p>
                                    <p class="chat_texto">${result.texto_tratamento}</p>
                                    <p class="chat_fonte">Fonte: ${result.fonte_tratamento}</p>
                                </div>`;
                        }

                        if (result.texto_prevencao) {
                            resultHtml += `
                                <div class="ttpa">
                                    <p class="chat_tipo">Prevenção:</p>
                                    <p class="chat_texto">${result.texto_prevencao}</p>
                                    <p class="chat_fonte">Fonte: ${result.fonte_prevencao}</p>
                                </div>`;
                        }

                        if (result.texto_publicoalvo) {
                            resultHtml += `
                                <div class="ttpa">
                                    <p class="chat_tipo">Público-Alvo:</p>
                                    <p class="chat_texto">${result.texto_publicoalvo}</p>
                                    <p class="chat_fonte">Fonte: ${result.fonte_publicoalvo}</p>
                                </div>`;
                        }

                        resultHtml += '</div>';
                    }

                    // Vídeos
                    if (result.thumbnails && result.thumbnails.length > 0) {
                        resultHtml += '<p class="chat_tipo">Vídeos relacionados:</p>'; 
                        resultHtml += '<div class="chat_video">';
                        result.thumbnails.forEach((thumb, index) => {
                            if (thumb) {
                                resultHtml += `
                                    <div class="card_video card">
                                        <img class="card_img" src="${thumb}" alt="Thumbnail do vídeo ${index + 1}">
                                        <div class="card_txt">
                                            <p class="card_title">${result.titles[index]}</p>
                                            <p class="card_fonte">Fonte: ${result.sources[index]}</p>
                                            <a target="_blank" href="${result.links[index]}"><button class="chat_button">Acesse</button></a>
                                        </div>
                                    </div>`;
                            }
                        });
                        resultHtml += '</div>';
                    }

                    // Links de Saiba Mais
                    if (result.paragrafo1 || result.paragrafo2 || result.paragrafo3) {
                        const saibaMaisCards = [];

                        if (result.paragrafo1) {
                            saibaMaisCards.push({
                                title: result.paragrafo1,
                                source: result.fonte_link1,
                                link: result.link1
                            });
                        }

                        if (result.paragrafo2) {
                            saibaMaisCards.push({
                                title: result.paragrafo2,
                                source: result.fonte_link2,
                                link: result.link2
                            });
                        }

                        if (result.paragrafo3) {
                            saibaMaisCards.push({
                                title: result.paragrafo3,
                                source: result.fonte_link3,
                                link: result.link3
                            });
                        }

                        createCarousel(saibaMaisCards);
                    }

                    resultHtml += '</div>';
                    resultsContainer.insertAdjacentHTML('beforeend', resultHtml);

                    // Adiciona o carrossel 360 graus após o carrossel Saiba Mais
                    const images360 = [
                        ' <a class="tr_pd2" href="https://www.britannica.com/" target="_blank"> <img src="/img/fonte1.png"></a>',
                        ' <a class="tr_pd2" href="https://mundoeducacao.uol.com.br/" target="_blank"><img src="/img/fonte2.png"></a>',
                        ' <a class="tr_pd2" href="https://medlineplus.gov/xml.html" target="_blank"><img src="/img/fonte3.png"> </a>',
                        ' <a class="tr_pd2" href="https://www.minhavida.com.br/" target="_blank"><img src="/img/fonte4.png"> </a>',
                        ' <a class="tr_pd2" href="https://hilab.com.br/" target="_blank"><img src="/img/fonte5.png"> </a>',
                        ' <a class="tr_pd2" href="https://www.princeton.edu/" target="_blank"><img src="/img/fonte6.png"> </a>',
                        ' <a class="tr_pd2" href="https://brasilescola.uol.com.br/" target="_blank"><img src="/img/fonte7.png"> </a>',
                        ' <a class="tr_pd2" href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z" target="_blank"><img src="/img/fonte8.png"> </a>',
                        ' <a class="tr_pd2" href="https://www.tuasaude.com/" target="_blank"><img src="/img/fonte9.png"> </a>',
                        ' <a class="tr_pd2" href="https://kidshealth.org/" target="_blank"><img src="/img/fonte10.jpeg"> </a>'
                    ];
                    createCarousel360(images360);
                });
            } catch (error) {
                console.error('Erro ao buscar resultados:', error);
            }
        }
    });

    // Função para carregar sugestões enquanto o usuário digita
    searchInput.addEventListener('input', async () => {
        const input = searchInput.value.trim();
        suggestionsBox.innerHTML = '';

        if (input) {
            try {
                const response = await fetch(`/suggestions?q=${encodeURIComponent(input)}`);
                const suggestions = await response.json();

                console.log('Suggestions:', suggestions);

                suggestions.forEach(suggestion => {
                    const suggestionDiv = document.createElement('div');
                    const titulo = suggestion.titulo;
                    const tambemChamado = suggestion.tambem_chamado ? ` (${suggestion.tambem_chamado})` : '';
                    suggestionDiv.textContent = `${titulo}${tambemChamado}`;
                    suggestionDiv.className = 'suggestion-item'; // Adiciona classe para estilização
                    suggestionDiv.addEventListener('click', () => {
                        searchInput.value = titulo;
                        suggestionsBox.innerHTML = '';
                        searchButton.click(); // Aciona a busca ao clicar em uma sugestão
                    });
                    suggestionsBox.appendChild(suggestionDiv);
                });
            } catch (error) {
                console.error('Erro ao buscar sugestões:', error);
            }
        }
    });

    // Função para mover o carrossel 360 graus automaticamente
    function startCarousel360() {
        const imagesCount = carousel360.children.length;
        if (imagesCount > 0) {
            const slideWidth = carousel360.children[0]?.clientWidth || 0;

            setInterval(() => {
                carousel360.style.transform = `translateX(-${slideWidth}px)`;
                setTimeout(() => {
                    carousel360.appendChild(carousel360.children[0]); // Move a primeira imagem para o final
                    carousel360.style.transition = 'none';
                    carousel360.style.transform = 'translateX(0)';
                    setTimeout(() => {
                        carousel360.style.transition = 'transform 0.5s ease';
                    }, 50);
                }, 500); // Sincroniza com o tempo de transição
            }, 3000); // Troca de imagem a cada 3 segundos
        }
    }

    startCarousel360();
});