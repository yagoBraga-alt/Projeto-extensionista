const recipes = {
      baunilha: `3 xícaras de trigo
1 xícara e meia de açúcar
3 ovos
3 colheres de manteiga
1 colher de sobremesa de baunilha
1 colher de sobremesa de fermento
1 pitada de sal`,

      chocolate: `2 xícaras de trigo
1 xícara de chocolate meio amargo
1 xícara e meia de açúcar
3 ovos
3 colheres de manteiga
1 colher de sobremesa de fermento
1 pitada de sal`,

      queijo: `2 xícaras de trigo
1 xícara de queijo ralado
3 ovos
3 colheres de manteiga
1 colher de sobremesa de fermento
1 pitada de sal`
    };

    window.addEventListener('DOMContentLoaded', () => {
      const modal = document.getElementById('recipeModal');
      const modalText = document.getElementById('modal-text');
      const closeBtn = document.getElementById('modalClose');

      function openModal(content) {
        modalText.textContent = content;
        modal.style.display = 'block';
      }

      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      window.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });

      document.getElementById('baunilhaBtn').addEventListener('click', () => {
        openModal(recipes.baunilha);
      });

      document.getElementById('chocolateBtn').addEventListener('click', () => {
        openModal(recipes.chocolate);
      });

      document.getElementById('queijoBtn').addEventListener('click', () => {
        openModal(recipes.queijo);
      });
    });