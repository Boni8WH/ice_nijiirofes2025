document.addEventListener('DOMContentLoaded', () => {

    const icecreamCards = document.querySelectorAll('.icecream-card');
    const rainbowRemainingEl = document.getElementById('rainbow-remaining');

    icecreamCards.forEach(card => {
        // --- 要素を取得 ---
        const cardName = card.dataset.name;
        const stockSetupEl = card.querySelector('.stock-setup');
        const initialStockInput = card.querySelector('.initial-stock-input');
        const setStockBtn = card.querySelector('.set-stock-btn');
        const salesControlsEl = card.querySelector('.sales-controls');
        const stockEl = card.querySelector('.stock');
        const plusBtn = card.querySelector('.plus-btn');
        const minusBtn = card.querySelector('.minus-btn');
        const sellCountEl = card.querySelector('.sell-count');
        const confirmBtn = card.querySelector('.confirm-btn');
        const correctBtn = card.querySelector('.correct-btn');
        const addStockInput = card.querySelector('.add-stock-input');
        const addStockBtn = card.querySelector('.add-stock-btn');
        const targetStockInput = card.querySelector('.target-stock-input');
        const setTargetBtn = card.querySelector('.set-target-btn');
        const targetStatusEl = card.querySelector('.target-status');

        // --- 変数を定義 ---
        let currentStock = 0;
        let maxStock = 0;
        let sellCount = 0;
        let targetStock = 0;

        // --- 関数を定義 ---
        // 目標ステータスを更新する関数
        const updateTargetDisplay = () => {
            if (targetStock > 0) {
                const availableToSell = currentStock - targetStock;
                if (availableToSell >= 0) {
                    targetStatusEl.textContent = `目標まであと ${availableToSell} 個`;
                } else {
                    targetStatusEl.textContent = '目標在庫を下回っています';
                }
            } else {
                targetStatusEl.textContent = '';
            }
        };

        // 在庫表示全体を更新する関数
        const updateDisplay = () => {
            if (cardName === 'レインボー') {
                rainbowRemainingEl.textContent = currentStock;
            }
            if (currentStock <= 0) {
                stockEl.innerHTML = '完売 🎉';
                card.classList.add('sold-out');
                plusBtn.disabled = true;
                confirmBtn.disabled = true;
            } else {
                stockEl.innerHTML = `残り: <span class="stock-count">${currentStock}</span>個`;
                card.classList.remove('sold-out');
                plusBtn.disabled = false;
                confirmBtn.disabled = false;
            }
            updateTargetDisplay();
        };

        // --- イベントリスナーを設定 ---
        // 1. 初期在庫を設定
        setStockBtn.addEventListener('click', () => {
            const initialValue = parseInt(initialStockInput.value);
            if (!isNaN(initialValue) && initialValue >= 0) {
                currentStock = initialValue;
                maxStock = initialValue;
                updateDisplay();
                stockSetupEl.classList.add('hidden');
                salesControlsEl.classList.remove('hidden');
            } else { alert('有効な数値を入力してください。'); }
        });

        // 2. 目標在庫を設定
        setTargetBtn.addEventListener('click', () => {
            const targetValue = parseInt(targetStockInput.value);
            if (!isNaN(targetValue) && targetValue >= 0) {
                if (targetValue > currentStock) {
                    alert('目標在庫は現在の在庫数以下に設定してください。');
                    return;
                }
                targetStock = targetValue;
                updateDisplay();
                targetStockInput.value = '';
            } else {
                alert('有効な目標数を入力してください。');
            }
        });

        // 3. 販売数を増やす (+)
        plusBtn.addEventListener('click', () => {
            const availableToSell = currentStock - targetStock;
            if (sellCount < availableToSell) {
                sellCount++;
                sellCountEl.textContent = sellCount;
            } else {
                alert(`目標在庫（${targetStock}個）を下回るため、これ以上追加できません。`);
            }
        });

        // 4. 販売数を減らす (-)
        minusBtn.addEventListener('click', () => {
            if (sellCount > 0) {
                sellCount--;
                sellCountEl.textContent = sellCount;
            }
        });

        // 5. 販売を確定する
        confirmBtn.addEventListener('click', () => {
            if (sellCount > 0 && sellCount <= currentStock) {
                currentStock -= sellCount;
                sellCount = 0;
                sellCountEl.textContent = '0';
                updateDisplay();
            }
        });
        
        // 6. 間違いを修正する
        correctBtn.addEventListener('click', () => {
            if (sellCount > 0) {
                if (currentStock + sellCount > maxStock) {
                    alert(`総在庫数（${maxStock}個）を超える修正はできません。`);
                    return;
                }
                currentStock += sellCount;
                sellCount = 0;
                sellCountEl.textContent = '0';
                updateDisplay();
            }
        });

        // 7. 在庫を追加する
        addStockBtn.addEventListener('click', () => {
            const additionalStock = parseInt(addStockInput.value);
            if (!isNaN(additionalStock) && additionalStock > 0) {
                currentStock += additionalStock;
                maxStock += additionalStock;
                addStockInput.value = '';
                updateDisplay();
            } else { alert('有効な追加数を入力してください。'); }
        });
    });
});