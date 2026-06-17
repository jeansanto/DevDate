const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const hintText = document.getElementById('hintText');

if (yesBtn && noBtn) {
    yesBtn.addEventListener('click', () => {
        window.location.href = 'page2.html';
    });

    let tentativas = 0;
    let estaFugindo = false;
    let posicaoAtual = { x: 0, y: 0 };
    const MAX_TENTATIVAS = 20;
    
    const frasesEngracadas = [
        '😅 Não vai me pegar!',
        '🏃‍♂️ Vem me pegar!',
        '😂 Quase... quase!',
        '😘 Só aceita o date!',
        '💨 Passou longe!',
        '🥺 Dá uma chance pro amor!',
        '😤 Tenta de novo!',
        '💕 O amor sempre vence!',
        '🤭 Errou! Hahaha!',
        '❤️ Desiste não!',
        '😏 Tá chegando perto...',
        '🎯 Tenta de novo!',
        '😈 Vai ter que se esforçar mais!',
        '🌈 O amor está te esperando!',
        '💪 Mais uma tentativa!',
        '🔥 Quase pegou!',
        '✨ O destino quer que você diga sim!',
        '😎 Tá ficando bom nisso!',
        '🎉 Você consegue!',
        '💖 Eu acredito em você!'
    ];

    function calcularNovaPosicao() {
        const container = noBtn.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        const btnWidth = noBtn.offsetWidth || 120;
        const btnHeight = noBtn.offsetHeight || 50;

        const margin = 15;
        const maxX = containerRect.width - btnWidth - margin;
        const maxY = containerRect.height - btnHeight - margin;
        
        let newX = margin + Math.random() * (maxX - margin);
        let newY = margin + Math.random() * (maxY - margin);
        
        const distanciaMinima = 80;
        let tentativasPosicao = 0;
        
        while (tentativasPosicao < 20) {
            const dx = newX - posicaoAtual.x;
            const dy = newY - posicaoAtual.y;
            const distancia = Math.sqrt(dx*dx + dy*dy);
            
            if (distancia > distanciaMinima) {
                break;
            }
            
            newX = margin + Math.random() * (maxX - margin);
            newY = margin + Math.random() * (maxY - margin);
            tentativasPosicao++;
        }
        
        return { x: newX, y: newY };
    }

    function fugir() {
        if (estaFugindo || tentativas >= MAX_TENTATIVAS) return;
        
        estaFugindo = true;
        
        const novaPos = calcularNovaPosicao();
        posicaoAtual = novaPos;
        
        noBtn.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
        noBtn.style.position = 'absolute';
        noBtn.style.left = novaPos.x + 'px';
        noBtn.style.top = novaPos.y + 'px';
        
        const rotacao = (Math.random() - 0.5) * 15;
        const escala = 0.85 + Math.random() * 0.3;
        noBtn.style.transform = `rotate(${rotacao}deg) scale(${escala})`;
        
        const cores = [
            '#ff6b8a', '#ff8a9b', '#ffb0c0', 
            '#e8d5d5', '#dcc8c8', '#f0d0d0'
        ];
        noBtn.style.background = cores[Math.floor(Math.random() * cores.length)];
        
        tentativas++;
        
        const fraseIndex = Math.min(tentativas - 1, frasesEngracadas.length - 1);
        if (hintText) {
            hintText.textContent = frasesEngracadas[fraseIndex];
            hintText.style.color = '#ff6b8a';
            hintText.style.fontWeight = '500';
            
            hintText.style.transition = 'all 0.15s';
            hintText.style.transform = 'scale(1.1)';
            setTimeout(() => {
                hintText.style.transform = 'scale(1)';
            }, 150);
        }
        
        setTimeout(() => {
            estaFugindo = false;
        }, 250);
        
        if (tentativas >= MAX_TENTATIVAS) {
            setTimeout(() => {
                desistir();
            }, 300);
        }
    }

    function desistir() {
        noBtn.style.transition = 'all 0.5s ease';
        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transform = 'scale(1)';
        noBtn.style.background = 'linear-gradient(135deg, #ff6b8a, #ff4d6d)';
        noBtn.style.color = '#fff';
        noBtn.textContent = '😭 TÁ BOM! EU ACEITO!';
        noBtn.style.width = 'auto';
        noBtn.style.padding = '14px 36px';
        
        if (hintText) {
            hintText.textContent = '😍 FINALMENTE! Agora clica no "Sim"! ❤️';
            hintText.style.color = '#4ecdc4';
            hintText.style.fontSize = '1.1rem';
            hintText.style.fontWeight = '600';
        }
        
        noBtn.removeEventListener('mouseenter', fugir);
        noBtn.removeEventListener('click', tentarClicar);
        noBtn.removeEventListener('mousedown', fugir);
        
        noBtn.addEventListener('click', () => {
            window.location.href = 'page2.html';
        });
    }

    function tentarClicar(e) {
        if (tentativas < MAX_TENTATIVAS) {
            e.preventDefault();
            e.stopPropagation();
            
            noBtn.style.transition = 'all 0.05s';
            noBtn.style.transform = 'scale(0.8)';
            setTimeout(() => {
                fugir();
            }, 80);
        }
    }

    function detectarAproximacao(e) {
        if (tentativas >= MAX_TENTATIVAS || estaFugindo) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const btnRect = noBtn.getBoundingClientRect();
        
        const centroX = btnRect.left + btnRect.width / 2;
        const centroY = btnRect.top + btnRect.height / 2;
        const distancia = Math.sqrt(
            Math.pow(mouseX - centroX, 2) + 
            Math.pow(mouseY - centroY, 2)
        );
        
        if (distancia < 100) {
            fugir();
        }
    }

    document.addEventListener('mousemove', detectarAproximacao);
    
    noBtn.addEventListener('mouseenter', fugir);
    
    noBtn.addEventListener('click', tentarClicar);
    
    noBtn.addEventListener('mousedown', (e) => {
        if (tentativas < MAX_TENTATIVAS) {
            e.preventDefault();
            fugir();
        }
    });
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (tentativas < MAX_TENTATIVAS && !estaFugindo) {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (noBtn.style.position === 'absolute') {
                    fugir();
                }
            }, 200);
        }
    });

    window.addEventListener('load', () => {
        noBtn.style.position = 'relative';
        noBtn.style.left = 'auto';
        noBtn.style.top = 'auto';
        noBtn.style.transform = 'none';
        posicaoAtual = { x: 0, y: 0 };
        
        setTimeout(() => {
            if (hintText) {
                hintText.textContent = '👀 Tenta clicar no "Não"... se conseguir!';
                hintText.style.color = '#ff6b8a';
                hintText.style.fontWeight = '500';
            }
        }, 300);
    });

    function verificarCantos() {
        if (tentativas >= MAX_TENTATIVAS || estaFugindo) return;
        
        const container = noBtn.parentElement;
        const containerRect = container.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();
        
        const noCanto = (
            btnRect.left < containerRect.left + 20 ||
            btnRect.right > containerRect.right - 20 ||
            btnRect.top < containerRect.top + 20 ||
            btnRect.bottom > containerRect.bottom - 20
        );
        
        if (noCanto) {
            fugir();
        }
    }
    
    setInterval(verificarCantos, 3000);
}

const nextBtn2 = document.getElementById('nextBtn2');
if (nextBtn2) {
    nextBtn2.addEventListener('click', () => {
        window.location.href = 'page3.html';
    });
}

const nextBtn3 = document.getElementById('nextBtn3');
if (nextBtn3) {
    nextBtn3.addEventListener('click', () => {
        const date = document.getElementById('datePicker').value;
        const time = document.getElementById('timePicker').value;

        if (!date || !time) {
            alert('📅 Preencha a data e o horário!');
            return;
        }

        localStorage.setItem('devDate', JSON.stringify({ date, time }));
        window.location.href = 'page4.html';
    });
}

const foodOptions = document.querySelectorAll('.food-option');
const nextBtn4 = document.getElementById('nextBtn4');

if (foodOptions.length) {
    foodOptions.forEach(option => {
        const checkbox = option.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
    });
}

if (nextBtn4) {
    nextBtn4.addEventListener('click', () => {
        const selected = document.querySelectorAll('.food-option.selected');
        if (selected.length === 0) {
            alert('🍽️ Escolha pelo menos uma comida!');
            return;
        }

        const foods = Array.from(selected).map(el => el.dataset.value);
        const saved = JSON.parse(localStorage.getItem('devDate') || '{}');
        saved.foods = foods;
        localStorage.setItem('devDate', JSON.stringify(saved));

        window.location.href = 'page5.html';
    });
}

function formatarData(dateStr) {
    if (!dateStr) return 'Sexta, 26 de Junho';
    const [y, m, d] = dateStr.split('-');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dt = new Date(y, m - 1, d);
    return `${dias[dt.getDay()]}, ${parseInt(d)} de ${meses[dt.getMonth()]}`;
}

function formatarHorario(timeStr) {
    if (!timeStr) return '19:30';
    const [h, m] = timeStr.split(':');
    return `${h}:${m}`;
}

const savedData = JSON.parse(localStorage.getItem('devDate') || '{}');
const displayDate = document.getElementById('displayDate');
const displayTime = document.getElementById('displayTime');
const displayFood = document.getElementById('displayFood');

if (displayDate) {
    displayDate.textContent = formatarData(savedData.date);
}

if (displayTime) {
    displayTime.textContent = formatarHorario(savedData.time);
}

if (displayFood) {
    const foods = savedData.foods || ['Tacos'];
    displayFood.textContent = foods.join(', ');
}

function copyPlan() {
    const date = displayDate ? displayDate.textContent : 'Sexta, 26 de Junho';
    const time = displayTime ? displayTime.textContent : '19:30';
    const food = displayFood ? displayFood.textContent : 'Tacos';

    const message = `📅 ${date} às ${time}\n🍽️ Comida: ${food}\n\nMal posso esperar! ❤️`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message)
            .then(() => alert('✅ Plano copiado! Agora é só colar no chat ❤️'))
            .catch(() => fallbackCopy(message));
    } else {
        fallbackCopy(message);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('✅ Plano copiado! Agora é só colar no chat ❤️');
}

function restart() {
    localStorage.clear();
    window.location.href = 'index.html';
}