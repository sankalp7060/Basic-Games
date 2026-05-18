# HIGH-LEVEL & LOW-LEVEL TECHNICAL DESIGN SPECIFICATION
## EShoppingZone Microservices E-Commerce Platform

---

## 1. High-Level Design (HLD)

The High-Level Design of **EShoppingZone** models the platform's overall boundaries, subsystem relationships, architectural topologies, and system policies.

### 1.1. System Context & Decomposition
EShoppingZone is decomposed into decoupled, specialized domain clusters. Each cluster is stateless and manages its own business contexts:

```mermaid
graph TD
    Client[React Web Client: Port 5173] -->|HTTPS Requests| Gateway[Yarp API Gateway: Port 8080]
    
    subgraph Microservices Boundary
        Gateway -->|/api/auth/* & /api/profile/*| Profile[Profile Service: Port 5001]
        Gateway -->|/api/products/*| Product[Product Service: Port 5002]
        Gateway -->|/api/cart/*| Cart[Cart Service: Port 5003]
        Gateway -->|/api/orders/*| Order[Order Service: Port 5004]
        Gateway -->|/api/wallet/*| Wallet[Wallet Service: Port 5005]
    end
    
    subgraph Data Layer
        Profile -->|EF Core PostgreSQL| DB1[(EShoppingZoneDB: PostgreSQL)]
        Product -->|EF Core PostgreSQL| DB1
        Cart -->|EF Core PostgreSQL| DB1
        Order -->|EF Core PostgreSQL| DB1
        Wallet -->|EF Core PostgreSQL| DB1
    end
```

### 1.2. HLD Core Design Patterns
1. **API Gateway Pattern**: Implemented via Yarp (Yet Another Reverse Proxy) at Port 8080. The gateway is the single entry point, masking microservice IP addresses, managing client CORS rules, and passing JWT headers.
2. **Database-Per-Service (Logical Isolation)**: To ensure microservice database isolation, each C# project maintains an independent Entity Framework `DbContext` mapping only its respective Domain Entities.
3. **Stateless Services**: All microservices are completely stateless. Sessions are validated on the client side using JSON Web Tokens (JWT) and validated in the backend by an auth filter middleware.
4. **Double-Entry Financial Ledger**: The Wallet microservice maintains absolute financial ledger compliance, logging all credits and debits as permanent transactions.

### 1.3. Security & Authentication Architecture
* **Token-Based Authentication**: The frontend receives a JWT and Refresh Token upon login.
* **Claims-Based Authorization**: JWT payloads store the User ID, Email, and Role Enum (`Customer`, `Merchant`, `Admin`, `DeliveryAgent`). Microservices intercept the bearer token and enforce Role-Based Access Control (RBAC) via the C# `[Authorize(Roles = "...")]` filter attributes.
* **BCrypt Hashing**: All local passwords are cryptographically salted and hashed using BCrypt before database persistence.

### 1.4. System Resilience & Fault Tolerance
* **Centralized Exception Handling Middleware**: Every microservice implements a custom global exception interceptor (`GlobalExceptionMiddleware`). This catches raw database or runtime errors and converts them into standardized JSON error responses.
* **Entity Framework Retry Policies**: Database connection strings are configured with transient failure resilience, retrying queries in case of temporary database connection losses.
* **Stateless API Gateway Proxies**: If a microservice crashes, Yarp returns standard 502/503 HTTP status codes without compromising the gateway or other running services.

---

## 2. Low-Level Design (LLD)

The Low-Level Design focuses on the internal class structures, Clean Architecture design layers, data flow sequences, and detailed class contracts inside each C# microservice.

### 2.1. C# Clean Architecture execution Flow
Below is a sequence flowchart tracing exactly how an incoming HTTP request traverses the C# application layers to fetch or modify data and return a response:

```mermaid
graph TD
    Request[HTTP Request] --> API[1. API Presentation Layer: Controller]
    
    subgraph C# Layer Boundaries
        API -->|1. Triggers DTO Request| AppService[2. Application Layer: Service]
        AppService -->|2. Validates Domain Request| DomainEntity[3. Domain Layer: Entity & Interfaces]
        AppService -->|3. Invokes Repository| InfraRepo[4. Infrastructure Layer: Repository]
        InfraRepo -->|4. Queries Database| EFContext[5. Infrastructure Layer: EF DbContext]
    end
    
    EFContext -->|Raw SQL Statement| Postgres[(PostgreSQL Database)]
    Postgres -->|Result Set| EFContext
    EFContext -->|Hydrates Entities| InfraRepo
    InfraRepo -->|Returns Domain Entity| AppService
    AppService -->|Maps Entity to returning DTO| API
    API -->|HTTP 200 OK JSON Response| Request
```

### 2.2. Standard Clean Architecture Layer Definitions
Every microservice is structured into four visual project layers to isolate responsibilities:

1. **Domain Project (`.Domain.csproj`)**
   * *Purpose*: Contains domain models, value structures, enums, and repository contract interfaces.
   * *Dependencies*: Absolutely none.
   * *Core Symbol Example*: [UserEntity](file:///c:/Sprint/backend/services/profile-service/src/EShoppingZone.Profile.Domain/Entities/UserEntity.cs), inheriting from `BaseEntity`.

2. **Application Project (`.Application.csproj`)**
   * *Purpose*: Defines service interfaces, business use-cases, and Data Transfer Objects (DTOs).
   * *Dependencies*: Only references the `.Domain` project.
   * *Core Symbol Example*: [IProfileService](file:///c:/Sprint/backend/services/profile-service/src/EShoppingZone.Profile.Application/Services/IProfileService.cs) and [ProfileResponse DTO](file:///c:/Sprint/backend/services/profile-service/src/EShoppingZone.Profile.Application/DTOs/ProfileDTOs.cs).

3. **Infrastructure Project (`.Infrastructure.csproj`)**
   * *Purpose*: Holds EF Core DbContext, concrete repositories, migrations, and third-party utilities.
   * *Dependencies*: References the `.Application` layer.
   * *Core Symbol Example*: [ApplicationDbContext](file:///c:/Sprint/backend/services/profile-service/src/EShoppingZone.Profile.Infrastructure/Data/ApplicationDbContext.cs).

4. **API Presentation Project (`.API.csproj`)**
   * *Purpose*: Implements controllers, routing middleware, and program configurations.
   * *Dependencies*: References the `.Infrastructure` layer.
   * *Core Symbol Example*: [ProfileController](file:///c:/Sprint/backend/services/profile-service/src/EShoppingZone.Profile.API/Controllers/ProfileController.cs).

---

## 3. Database Schema & Entity Relationship Model

The database schemas are designed around normal forms (1NF, 2NF, 3NF) using Entity Framework Fluent configurations to map C# fields to PostgreSQL attributes.

```mermaid
erDiagram
    Users ||--o{ Addresses : "registers"
    Users ||--o{ RefreshTokens : "authorizes"
    Users ||--o| Wallets : "owns"
    Wallets ||--o{ Statements : "logs"
    Users ||--o{ Orders : "submits"
    Orders ||--|{ OrderItems : "contains"
    Orders ||--o{ OrderStatusHistories : "tracks"
    Carts ||--o{ CartItems : "holds"
    Users ||--o| Carts : "creates"
    
    Users {
        int Id PK
        string FullName
        string Email UK
        string PasswordHash
        string ProfileImage
        long MobileNumber
        string About
        DateTime DateOfBirth
        string Gender
        int Role
        bool IsEmailVerified
        string OAuthProvider
        string OAuthId
        string CustomMessage
        DateTime CreatedAt
        DateTime UpdatedAt
        bool IsActive
    }
    
    Addresses {
        int Id PK
        int UserId FK
        string HouseNumber
        string StreetName
        string ColonyName
        string City
        string State
        string Pincode
        string Landmark
        bool IsDefault
        DateTime CreatedAt
        DateTime UpdatedAt
        bool IsActive
    }

    Wallets {
        int Id PK
        int UserId FK "Unique"
        decimal CurrentBalance
        DateTime LastTransactionAt
        DateTime CreatedAt
        DateTime UpdatedAt
        bool IsActive
    }

    Statements {
        int Id PK
        int WalletId FK
        string TransactionType
        decimal Amount
        DateTime TransactionDate
        int OrderId
        string TransactionRemarks
        decimal BalanceAfterTransaction
        DateTime CreatedAt
        DateTime UpdatedAt
        bool IsActive
    }

    Products {
        int Id PK
        string ProductName
        string ProductType
        string Category
        decimal Price
        string Description
        int StockQuantity
        JSONB Ratings
        JSONB Images
        JSONB Specifications
        int MerchantId FK
        DateTime CreatedAt
        DateTime UpdatedAt
        bool IsActive
    }
```

### 3.1. Detailed Database Table Definitions

#### A. `Users` Table (Profile/Auth Service)
* **`Id`** (`INT`, PK, Auto-Increment): Unique sequential identifier.
* **`FullName`** (`VARCHAR(200)`, Not Null): Full legal name of the user.
* **`Email`** (`VARCHAR(200)`, Unique Index, Not Null): Contact email, used as login username.
* **`PasswordHash`** (`VARCHAR(500)`, Nullable): BCrypt hashed password. Set to null for Google OAuth users.
* **`ProfileImage`** (`VARCHAR(2000)`, Nullable): URL string pointing to avatar resource.
* **`MobileNumber`** (`BIGINT`, Index, Not Null): 10-digit mobile number for notification routing.
* **`About`** (`VARCHAR(2000)`, Nullable): Biographical notes.
* **`DateOfBirth`** (`TIMESTAMP`, Nullable): Date of birth.
* **`Gender`** (`VARCHAR(20)`, Nullable): Self-declared gender ("Male", "Female", "Other").
* **`Role`** (`INT`, Index, Not Null): Role mapping (`1` = Customer, `2` = Merchant, `3` = Admin, `4` = DeliveryAgent).
* **`IsEmailVerified`** (`BOOLEAN`, Default `false`): Email validation status.
* **`OAuthProvider`** (`VARCHAR(100)`, Nullable): Identity provider name (e.g., `"Google"`).
* **`OAuthId`** (`VARCHAR(200)`, Nullable): External client token ID from provider.
* **`CustomMessage`** (`VARCHAR(200)`, Nullable): **[NEW]** Demonstration column for interviewer test button, defaults to null.
* **`CreatedAt`** (`TIMESTAMP`, Not Null): Row insertion timestamp.
* **`UpdatedAt`** (`TIMESTAMP`, Nullable): Last modification timestamp.
* **`IsActive`** (`BOOLEAN`, Default `true`): Soft-delete indicator.

#### B. `Addresses` Table (Profile Service)
* **`Id`** (`INT`, PK, Auto-Increment): Address serial key.
* **`UserId`** (`INT`, FK to `Users.Id`, Cascade Delete, Not Null): Identifies address owner.
* **`HouseNumber`** (`VARCHAR(50)`, Not Null): Flat/House number.
* **`StreetName`** (`VARCHAR(200)`, Not Null): Road or street.
* **`ColonyName`** (`VARCHAR(200)`, Nullable): Neighborhood identifiers.
* **`City`** (`VARCHAR(100)`, Not Null): City.
* **`State`** (`VARCHAR(100)`, Not Null): State/Province.
* **`Pincode`** (`VARCHAR(10)`, Not Null): Zip/Postal code.
* **`Landmark`** (`VARCHAR(200)`, Nullable): Proximity markers.
* **`IsDefault`** (`BOOLEAN`, Default `false`): Flag for default checkout selection.
* **`CreatedAt`** (`TIMESTAMP`, Not Null): Row insertion timestamp.
* **`IsActive`** (`BOOLEAN`, Default `true`): Soft-delete indicator.

#### C. `Wallets` Table (Wallet Service)
* **`Id`** (`INT`, PK, Auto-Increment): Unique wallet reference serial.
* **`UserId`** (`INT`, Unique Index, FK to `Users.Id`, Not Null): Wallet owner.
* **`CurrentBalance`** (`DECIMAL(18,2)`, Default `0.00`, Not Null): Available cash balance. Must be `>= 0.00`.
* **`LastTransactionAt`** (`TIMESTAMP`, Nullable): Timestamp of the last statement operation.
* **`CreatedAt`** (`TIMESTAMP`, Not Null): Wallet creation date.
* **`IsActive`** (`BOOLEAN`, Default `true`): Active flag.

#### D. `Statements` Table (Wallet Service)
* **`Id`** (`INT`, PK, Auto-Increment): Transaction unique reference serial.
* **`WalletId`** (`INT`, FK to `Wallets.Id`, Cascade Delete, Not Null): Targeted wallet.
* **`TransactionType`** (`VARCHAR(10)`, Not Null): Type of ledger entry (`"CREDIT"` or `"DEBIT"`).
* **`Amount`** (`DECIMAL(18,2)`, Not Null): Absolute transaction value.
* **`TransactionDate`** (`TIMESTAMP`, Not Null): Exact execution timestamp.
* **`OrderId`** (`INT`, Nullable): Reference link to `Orders` table if representing an order checkout.
* **`TransactionRemarks`** (`VARCHAR(500)`, Not Null): Description (e.g. `"Card Deposit"`, `"Debit for Order #3"`).
* **`BalanceAfterTransaction`** (`DECIMAL(18,2)`, Not Null): Real-time balance snapshot for transactional integrity.
* **`CreatedAt`** (`TIMESTAMP`, Not Null): Row insertion timestamp.
* **`IsActive`** (`BOOLEAN`, Default `true`): Active flag.

#### E. `Products` Table (Product Service)
* **`Id`** (`INT`, PK, Auto-Increment): Product reference key.
* **`ProductName`** (`VARCHAR(200)`, Not Null): Listing title.
* **`ProductType`** (`VARCHAR(100)`, Not Null): Filter category tag.
* **`Category`** (`VARCHAR(100)`, Not Null): Display catalog grouping (e.g. `"Electronics"`).
* **`Price`** (`DECIMAL(18,2)`, Not Null): Listing price per unit.
* **`Description`** (`TEXT`, Not Null): Rich text product description.
* **`StockQuantity`** (`INT`, Default `0`, Not Null): Stock levels. Must be `>= 0`.
* **`Ratings`** (`JSONB`): Key-value pair of rating distributions (e.g. `{"5": 100, "4": 12}`).
* **`Images`** (`JSONB`): Array of image URL strings.
* **`Specifications`** (`JSONB`): Dictionary of tech specs (e.g., `{"RAM": "16GB"}`).
* **`MerchantId`** (`INT`, FK to `Users.Id`, Not Null): Identifies the seller.
* **`CreatedAt`** (`TIMESTAMP`, Not Null): Row insertion timestamp.
* **`IsActive`** (`BOOLEAN`, Default `true`): Active flag.

---

## 4. Backend HTTP API Endpoint Registry

The HTTP Endpoint Registry lists the exact REST APIs available in the backend services for routing through Yarp:

### 4.1. Authentication & Profile Controller (`profile-service`)
Managed by the Profile microservice at `http://localhost:5001`.

| HTTP Verb | Path Route | Authorization | Request Body Schema | Response Body Schema |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Anonymous | `{ Email, Password, FullName, MobileNumber, Role }` | `{ success: bool, message: string }` |
| `POST` | `/api/auth/login` | Anonymous | `{ Email, Password }` | `{ success: bool, token: string, refreshToken: string, user: UserDTO }` |
| `POST` | `/api/auth/refresh` | Anonymous | `{ Token, RefreshToken }` | `{ success: bool, token: string, refreshToken: string }` |
| `GET` | `/api/profile/me` | Bearer JWT | None | `{ success: bool, data: ProfileResponse }` |
| `PUT` | `/api/profile/update` | Bearer JWT | `{ FullName?, MobileNumber?, About?, DateOfBirth?, Gender?, ProfileImage? }` | `{ success: bool, data: ProfileResponse, message: string }` |
| `POST` | `/api/profile/upload-image`| Bearer JWT | `{ ImageUrl }` | `{ success: bool, data: ProfileResponse }` |
| `DELETE`| `/api/profile/image` | Bearer JWT | None | `{ success: bool, message: string }` |
| `GET` | `/api/profile/addresses`| Bearer JWT | None | `{ success: bool, data: List<AddressDto> }` |
| `POST` | `/api/profile/address` | Bearer JWT | `{ HouseNumber, StreetName, ColonyName?, City, State, Pincode, Landmark?, IsDefault }` | `{ success: bool, data: AddressDto }` |
| `DELETE`| `/api/profile/address/{id}`| Bearer JWT | None | `{ success: bool, message: string }` |
| `PATCH` | `/api/profile/address/{id}/default`| Bearer JWT | None | `{ success: bool, data: AddressDto }` |
| `PATCH` | `/api/profile/custom-message`| Bearer JWT | `{ Message }` | `{ success: bool, data: ProfileResponse, message: string }` |

### 4.2. Product Catalog Controller (`product-service`)
Managed by the Product microservice at `http://localhost:5002`.

| HTTP Verb | Path Route | Authorization | Request Parameters | Response Body Schema |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Anonymous | `page`, `pageSize`, `sortBy`, `search`, `category` | `{ success: bool, data: { products: List<Product>, totalPages: int } }` |
| `GET` | `/api/products/{id}` | Anonymous | None | `{ success: bool, data: Product }` |
| `POST` | `/api/products` | Merchant | `{ ProductName, ProductType, Category, Price, Description, StockQuantity, Specifications, Images }` | `{ success: bool, data: Product }` |
| `PUT` | `/api/products/{id}/stock`| Merchant | `{ StockQuantity }` | `{ success: bool, message: string }` |
| `GET` | `/api/products/categories`| Anonymous | None | `{ success: bool, data: List<string> }` |

### 4.3. Shopping Cart Controller (`cart-service`)
Managed by the Cart microservice at `http://localhost:5003`.

| HTTP Verb | Path Route | Authorization | Request Body Schema | Response Body Schema |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Customer | None | `{ success: bool, data: CartResponse }` |
| `POST` | `/api/cart/add` | Customer | `{ ProductId, Quantity }` | `{ success: bool, data: CartResponse, message: string }` |
| `PUT` | `/api/cart/item` | Customer | `{ ProductId, Quantity }` | `{ success: bool, data: CartResponse }` |
| `DELETE`| `/api/cart/item/{productId}`| Customer | None | `{ success: bool, data: CartResponse }` |
| `DELETE`| `/api/cart/clear` | Customer | None | `{ success: bool, message: string }` |

### 4.4. Order Checkout Controller (`order-service`)
Managed by the Order microservice at `http://localhost:5004`.

| HTTP Verb | Path Route | Authorization | Request Body Schema | Response Body Schema |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Customer | `{ ModeOfPayment, AddressId, CartItems: List<CartItem> }` | `{ success: bool, orderId: int, message: string }` |
| `GET` | `/api/orders/history` | Customer | None | `{ success: bool, data: List<OrderResponse> }` |
| `GET` | `/api/orders/{id}` | Bearer JWT | None | `{ success: bool, data: OrderResponse }` |
| `PUT` | `/api/orders/{id}/cancel` | Customer | `{ CancellationReason }` | `{ success: bool, message: string }` |
| `PATCH` | `/api/orders/{id}/status` | Admin/Courier | `{ OrderStatus }` | `{ success: bool, message: string }` |

### 4.5. Wallet & Statement Controller (`wallet-service`)
Managed by the Wallet microservice at `http://localhost:5005`.

| HTTP Verb | Path Route | Authorization | Request Body Schema | Response Body Schema |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/wallet/balance` | Bearer JWT | None | `{ success: bool, data: decimal }` |
| `POST` | `/api/wallet/credit` | Bearer JWT | `{ Amount, Remarks }` | `{ success: bool, data: WalletDTO, message: string }` |
| `POST` | `/api/wallet/debit` | Bearer JWT | `{ Amount, Remarks }` | `{ success: bool, data: WalletDTO, message: string }` |
| `GET` | `/api/wallet/statements`| Bearer JWT | None | `{ success: bool, data: List<StatementDTO> }` |

---

## 5. Frontend State & Component Specifications

The React application uses context-driven state management to decouple route presentation from remote REST endpoints.

```mermaid
graph TD
    App[App.jsx] --> AuthProvider[AuthProviderContext]
    AuthProvider --> CartProvider[CartProviderContext]
    CartProvider --> Router[AppRoutes.jsx]
    
    Router --> Home[HomePage.jsx]
    Router --> Detail[ProductDetail.jsx]
    Router --> CartPage[Cart.jsx]
    Router --> CheckoutPage[Checkout.jsx]
    Router --> WalletPage[Wallet.jsx]
    Router --> ProfilePage[Profile.jsx]
```

### 5.1. Core Context Providers
* **`AuthProvider.jsx`**: Exposes authentication status (`isAuthenticated`), user profile payload (`user`), `login` handler (attaching JWT/Refresh Token to local storage), and `logout` execution blocks.
* **`CartProvider.jsx`**: Manages customer cart state (`cartItems`, `totalQuantity`, `totalPrice`), synchronizes item updates with the API server, and automatically clears active selections upon order placement.

### 5.2. Exhaustive Button & Interaction Action Map
Detailed specifications for every button and input element on the React web client:

#### A. Authentication Screens (`Login.jsx`, `Register.jsx`)
* **"Sign In" Button**
  * *Class:* `btn-auth-submit`
  * *Click Action:* Submits login details, retrieves a JWT, saves it in local storage, updates the `AuthProvider` state, and redirects the client to the `/` route.
  * *API Call:* `POST /api/auth/login` with Email and Password payload.
* **"Google Login" Icon/Button**
  * *Class:* `google-auth-btn`
  * *Click Action:* Authenticates credentials via Google OAuth, updates context profile data, and navigates home.
  * *API Call:* Third-party redirect followed by local payload mapping verification.
* **"Sign Up" Button**
  * *Class:* `btn-auth-submit`
  * *Click Action:* Submits the registration form, showing a success notification, and redirects to `/login`.
  * *API Call:* `POST /api/auth/register` with account metadata.

#### B. Home Page (`HomePage.jsx`)
* **"Explore Collection" Button**
  * *Class:* `btn-add-to-cart hero-btn`
  * *Click Action:* Scrolls the browser view smoothly to the `#collection` anchor catalog grid.
  * *API Call:* None (client scroll effect).
* **"Our Story" Button**
  * *Class:* `btn-view-details hero-btn`
  * *Click Action:* Sets local state `showStoryModal` to true, opening the modal popup block.
  * *API Call:* None.
* **"Clickable" Button (Interviewer DB Update)**
  * *Class:* `btn-view-details hero-btn`
  * *Click Action:* Sends a PATCH request to write `"hi"` directly to the new database column for the logged-in user, showing a success alert.
  * *API Call:* `PATCH /api/profile/custom-message` with body `{ message: "hi" }`.
* **"Category Chips" (All, Electronics, Apparel, etc.)**
  * *Class:* `category-chip`
  * *Click Action:* Sets the selected category state and resets pagination.
  * *API Call:* `GET /api/products?category={category}&page=1`.

#### C. Product Details Screen (`ProductDetail.jsx`)
* **"Add to Cart" Button**
  * *Class:* `btn-add-to-cart`
  * *Click Action:* Increments the context shopping cart state, keeping it synchronized with the database.
  * *API Call:* `POST /api/cart/add` with payload `{ productId, quantity: 1 }`.
* **"Buy Now" Button**
  * *Class:* `btn-buy-now`
  * *Click Action:* Adds the target item to the cart and navigates directly to the checkout screen.
  * *API Call:* `POST /api/cart/add` followed by redirect to `/checkout`.

#### D. Shopping Cart Screen (`Cart.jsx`)
* **"Quantity Adjusters" (+ and -)**
  * *Class:* `quantity-btn`
  * *Click Action:* Increments or decrements item quantities in the shopping cart.
  * *API Call:* `PUT /api/cart/item` with target quantity.
* **"Remove Item" Icon**
  * *Class:* `cart-remove-icon`
  * *Click Action:* Deletes the target item from the cart grid.
  * *API Call:* `DELETE /api/cart/item/{productId}`.
* **"Proceed to Checkout" Button**
  * *Class:* `checkout-proceed-btn`
  * *Click Action:* Navigates the client routing stack directly to the `/checkout` route.
  * *API Call:* None (client route transition).

#### E. Checkout Screen (`Checkout.jsx`)
* **"Place Order via Wallet" Button**
  * *Class:* `place-order-wallet-btn`
  * *Click Action:* Debits the total price from the wallet ledger, creates the order, clears the cart, and redirects to the orders dashboard.
  * *API Call:* 
    1. `POST /api/wallet/debit` (with remarks `"Order Checkout"`)
    2. `POST /api/orders` (creating order items)
    3. `DELETE /api/cart/clear` (emptying shopping selections)

#### F. Wallet Dashboard (`Wallet.jsx`)
* **"Deposit" Button**
  * *Class:* `wallet-deposit-btn`
  * *Click Action:* Credits funds to the wallet and refreshes the ledger statements view.
  * *API Call:* `POST /api/wallet/credit` with amount and remarks payload.

#### G. Profile & Location Hub (`Profile.jsx`)
* **"Save Profile Changes" Button**
  * *Class:* `profile-save-btn`
  * *Click Action:* Saves updated profile fields (name, phone, bio) to the database.
  * *API Call:* `PUT /api/profile/update` with changed fields.
* **"Set Default Address" Star**
  * *Class:* `address-star-icon`
  * *Click Action:* Sets the chosen address as the default checkout shipping location.
  * *API Call:* `PATCH /api/profile/address/{addressId}/default`.

---

## 6. System Core Workflows (UML Communication Reference)

### 6.1. Authentication & Security Session Flow
Coordinates sign-up and login, issuing JWT keys and syncing session states.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Client App (React)
    participant Gateway as API Gateway (Yarp)
    participant Auth as Auth Service (Profile.API)
    participant Postgres as PostgreSQL DB

    Client->>Gateway: POST /api/auth/login {Email, Password}
    Gateway->>Auth: Route request
    Auth->>Postgres: SELECT * FROM Users WHERE Email = input
    Postgres-->>Auth: User records (Password Hash)
    Auth->>Auth: Verify Bcrypt(Password, Hash)
    
    alt Verification Success
        Auth->>Postgres: Create Refresh Token Record
        Postgres-->>Auth: Saved success
        Auth->>Auth: Generate JWT (Role, ID, FullName)
        Auth-->>Gateway: 200 OK {JWT, RefreshToken, UserDTO}
        Gateway-->>Client: 200 OK {JWT, RefreshToken, UserDTO}
        Client->>Client: Save JWT in localStorage and Update AuthContext
    else Verification Failed
        Auth-->>Gateway: 401 Unauthorized {ErrorMsg}
        Gateway-->>Client: 401 Unauthorized {ErrorMsg}
    end
```

### 6.2. Checkout & Wallet Ledger Payment Transaction
Ensures financial security, balance checking, ledger audit trails, and order processing.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Customer (React Client)
    participant Wallet as Wallet Service
    participant Order as Order Service
    participant Cart as Cart Service
    participant DB as PostgreSQL DB

    Client->>Wallet: POST /api/wallet/debit {Amount: $X}
    Note over Wallet, DB: Transaction check & balance validation
    Wallet->>DB: UPDATE Wallets SET Balance = Balance - X WHERE UserId = Current
    DB-->>Wallet: Row updated
    Wallet->>DB: INSERT INTO Statements (Debit, BalanceAfter)
    DB-->>Wallet: Ledger logged
    Wallet-->>Client: 200 OK {Success: true}

    Client->>Order: POST /api/orders {CartItems, AddressSnapshot}
    Order->>DB: INSERT INTO Orders, OrderItems, OrderStatusHistory
    DB-->>Order: Saved success
    Order-->>Client: 200 OK {OrderId: Y}

    Client->>Cart: DELETE /api/cart/clear
    Cart->>DB: DELETE FROM CartItems WHERE CartId = CurrentCart
    DB-->>Cart: Cleared
    Cart-->>Client: 200 OK (Cart empty)
```

### 6.3. Interviewer "Clickable" DB Update Flow
Demonstrates the database update workflow triggered by our new homepage button.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Customer/Interviewer (React)
    participant Gateway as API Gateway
    participant Profile as Profile Service
    participant DB as PostgreSQL DB

    Client->>Client: Clicks "Clickable" Hero Button
    Client->>Gateway: PATCH /api/profile/custom-message { message: "hi" }
    Gateway->>Profile: Route request (validates JWT)
    Profile->>DB: SELECT * FROM Users WHERE Id = ClaimUserID
    DB-->>Profile: User entity record
    Profile->>Profile: Update entity property CustomMessage = "hi"
    Profile->>DB: UPDATE Users SET CustomMessage = "hi" WHERE Id = UserID
    DB-->>Profile: Column updated successfully
    Profile-->>Gateway: 200 OK { UpdatedProfileDTO }
    Gateway-->>Client: 200 OK { UpdatedProfileDTO }
    Client->>Client: Alert "Success! 'hi' written to DB"
```

---

## 7. Local Setup, Migration & Ports Guide

### 7.1. Entity Framework Core Migration
To propagate database schema changes (like adding the `CustomMessage` column) to your database using the .NET CLI:
1. **Migration Generation:**
   ```powershell
   cd C:\Sprint\backend\services\profile-service\src\EShoppingZone.Profile.Infrastructure
   dotnet ef migrations add AddCustomMessageToUser --startup-project ..\EShoppingZone.Profile.API\EShoppingZone.Profile.API.csproj
   ```
2. **Apply Migration to Database:**
   ```powershell
   dotnet ef database update --startup-project ..\EShoppingZone.Profile.API\EShoppingZone.Profile.API.csproj
   ```
*Note: Because `profile-service` includes `await dbContext.Database.MigrateAsync();` on startup, simply launching the service will also automatically apply all pending migrations!*

### 7.2. Service Port Matrix
During local development, components run on the following port configurations:

| Component Service | Local Hosting Address | Core Database Connection |
| :--- | :--- | :--- |
| **React Frontend SPA** | `http://localhost:5173` | Context-Driven Memory State |
| **Yarp API Gateway** | `http://localhost:8080` | Proxy Cluster Rules Matrix |
| **Profile Microservice**| `http://localhost:5001` | `EShoppingZoneDB` PostgreSQL |
| **Product Microservice**| `http://localhost:5002` | `EShoppingZoneDB` PostgreSQL |
| **Cart Microservice** | `http://localhost:5003` | `EShoppingZoneDB` PostgreSQL |
| **Order Microservice** | `http://localhost:5004` | `EShoppingZoneDB` PostgreSQL |
| **Wallet Microservice** | `http://localhost:5005` | `EShoppingZoneDB` PostgreSQL |
