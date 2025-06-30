const API_URL = Cypress.env('BURGER_API_URL');

Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept('GET', `${API_URL}/ingredients`, ingredients).as(
      'getIngredients'
    );
  });

  cy.fixture('orders.json').then((orders) => {
    cy.intercept('GET', `${API_URL}/orders`, orders).as('getOrders');
  });

  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', `${API_URL}/auth/user`, user).as('getUser');
  });

  cy.fixture('newOrder.json').then((order) => {
    cy.intercept('POST', `${API_URL}/orders`, order).as('createOrder');
  });

  cy.visit('/');
  cy.wait('@getIngredients');
});

afterEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

describe('Конструктор бургеров', () => {
  it('должен отображать список ингредиентов', () => {
    cy.wait(2000);
    cy.get('[data-cy="ingredients-section"]').should('exist');
    cy.get('[data-cy="ingredient-item"]').should('have.length.greaterThan', 0);
  });

  it('должен добавлять булку в конструктор', function () {
    cy.contains('[data-cy="ingredient-item"]', 'Краторная булка N-200i')
      .should('exist')
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  });

  it('должен добавлять начинку в конструктор', () => {
    cy.contains(
      '[data-cy="ingredient-item"]',
      'Биокотлета из марсианской Магнолии'
    ).within(() => {
      cy.contains('button', 'Добавить').click();
    });
    cy.get('[data-cy="constructor-ingredients-list"]')
      .children()
      .should('have.length', 1);
  });
});

describe('Модальное окно ингредиента', () => {
  it('открывается и закрывается по кнопке закрытия', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-close-button"]').click();
  });

  it('закрывается по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
  });

  it('отображаются корректные данные выбранного ингредиента', () => {
    cy.contains('[data-cy="ingredient-item"]', 'Соус Spicy-X').click();
    cy.get('[data-cy="ingredient-details"]').should(
      'contain.text',
      'Соус Spicy-X'
    );
    cy.get('[data-cy="ingredient-image"]').should('exist');
  });
});

describe('Процесс создания заказа', () => {
  it('создает заказ и очищает конструктор', () => {
    // Добавляем булку
    cy.contains('[data-cy="ingredient-item"]', 'Краторная булка N-200i')
      .find('button')
      .click();

    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');

    // Добавляем начинку
    cy.contains(
      '[data-cy="ingredient-item"]',
      'Биокотлета из марсианской Магнолии'
    )
      .find('button')
      .click();

    cy.get('[data-cy="constructor-ingredients-list"]')
      .children()
      .should('have.length', 1);

    // Оформляем заказ
    cy.get('[data-cy="order-button"]').should('not.be.disabled').click();
    cy.wait('@createOrder').its('response.statusCode').should('eq', 200);

    // Проверяем что модальное окно появилось
    cy.get('[data-cy="order-number"]').should('contain.text', '40763');

    // Закрываем модальное окно
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="order-modal"]').should('not.exist');

    // Проверка очистки конструктора
    cy.get('[data-cy="constructor-ingredients-list"]')
      .find('[data-cy="constructor-ingredient"]')
      .should('have.length', 0);

    cy.get('[data-cy="empty-bun-top"]').should('exist');
    cy.get('[data-cy="empty-bun-bottom"]').should('exist');
  });
});
