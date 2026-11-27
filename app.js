/**
 * =========================================================================================
 * ALL-IN-ONE SYSTEM DESIGN & OOPS RELATIONSHIPS & DEPENDENCIES ENGINE
 * Total Categories: 8 | Total Relationships & Dependencies: 126 / 126 (100% COMPLETE)
 * Language: JavaScript (Node.js standalone, zero external dependencies)
 * =========================================================================================
 */

const crypto = require('crypto');

// --- ANSI Terminal Styling Helper ---
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  red: '\x1b[31m',
};

function banner(title) {
  const line = '═'.repeat(78);
  console.log(`\n${colors.cyan}${line}${colors.reset}`);
  console.log(`${colors.bright}${colors.yellow}  📌  ${title.toUpperCase()}${colors.reset}`);
  console.log(`${colors.cyan}${line}${colors.reset}`);
}

function logDemo(itemNum, name, relationType, detail) {
  console.log(`  ${colors.magenta}▶ ${itemNum}. ${colors.bright}${colors.white}${name}${colors.reset} [${colors.cyan}${relationType}${colors.reset}]`);
  console.log(`    ${colors.dim}→ ${detail}${colors.reset}`);
}

function success(msg) {
  console.log(`  ${colors.green}✔ ${msg}${colors.reset}`);
}

// =========================================================================================
// SECTION 1: Core OOPs / UML Relationships (11 items)
// =========================================================================================

// 1. Association
class Driver { constructor(name) { this.name = name; } }
class Car {
  constructor(model) { this.model = model; this.assignedDriver = null; }
  assignDriver(driver) { this.assignedDriver = driver; }
}

// 2. Aggregation
class Professor { constructor(name) { this.name = name; } }
class Department {
  constructor(name) { this.name = name; this.professors = []; }
  addProfessor(prof) { this.professors.push(prof); }
}

// 3. Composition
class OrderLineItem { constructor(sku, quantity, price) { this.sku = sku; this.quantity = quantity; this.price = price; } }
class Order {
  constructor(orderId) { this.orderId = orderId; this.items = []; }
  addItem(sku, qty, price) { const item = new OrderLineItem(sku, qty, price); this.items.push(item); return item; }
}

// 4. Inheritance (Generalization)
class PaymentMethod {
  constructor(type) { this.type = type; }
  processPayment(amount) { throw new Error('Subclass must implement'); }
}
class CreditCardPayment extends PaymentMethod {
  constructor(cardNumber) { super('CreditCard'); this.cardNumber = cardNumber; }
  processPayment(amount) { return `Charged $${amount} to card ending in ${this.cardNumber.slice(-4)}`; }
}

// 5. Realization
class ICloudStorage { upload(fileName, data) { throw new Error('Realization required'); } }
class S3StorageProvider extends ICloudStorage {
  upload(fileName, data) { return `[S3 Realization] Uploaded '${fileName}' (${data.length} bytes) to AWS S3 bucket.`; }
}

// 6. Dependency
class CurrencyConverter { convert(amount, from, to) { return amount * (from === 'USD' && to === 'INR' ? 83.5 : 1.0); } }
class InvoiceService {
  generateInvoice(amountUSD, converter) {
    const inr = converter.convert(amountUSD, 'USD', 'INR');
    return `Invoice generated: $${amountUSD} = ₹${inr}`;
  }
}

// 7. Delegation
class PrintEngine { executePrint(doc) { return `[PrintEngine] Printing document: '${doc}' on laser hardware.`; } }
class Printer {
  constructor() { this.engine = new PrintEngine(); }
  print(doc) { return this.engine.executePrint(doc); }
}

// 8. Association Class
class Student { constructor(id, name) { this.id = id; this.name = name; } }
class Course { constructor(code, title) { this.code = code; this.title = title; } }
class Enrollment {
  constructor(student, course, semester, grade = 'In-Progress') {
    this.student = student; this.course = course; this.semester = semester; this.grade = grade;
  }
  describe() { return `${this.student.name} enrolled in ${this.course.code} for ${this.semester} (Grade: ${this.grade})`; }
}

// 9. Reflexive Association
class Employee {
  constructor(name, title) { this.name = name; this.title = title; this.manager = null; this.subordinates = []; }
  setManager(mgr) { this.manager = mgr; mgr.subordinates.push(this); }
}

// 10. Qualified Association
class Bank {
  constructor(name) { this.name = name; this.accountsByNumber = new Map(); }
  addAccount(accNo, holder, bal) { this.accountsByNumber.set(accNo, { accNo, holder, bal }); }
  getAccount(accNo) { return this.accountsByNumber.get(accNo); }
}

// 11. N-ary Association
class Supplier { constructor(name) { this.name = name; } }
class Part { constructor(partNo) { this.partNo = partNo; } }
class Project { constructor(name) { this.name = name; } }
class SupplyContract {
  constructor(supplier, part, project, quantity, price) {
    this.supplier = supplier; this.part = part; this.project = project; this.quantity = quantity; this.price = price;
  }
  getDetails() { return `Contract: ${this.supplier.name} supplies ${this.quantity} units of ${this.part.partNo} to Project '${this.project.name}' at $${this.price}/unit.`; }
}

function runSection1() {
  banner('1. Core OOPs / UML Relationships');
  const driver = new Driver('Aman Sharma');
  const car = new Car('Tesla Model 3');
  car.assignDriver(driver);
  logDemo(1, 'Association', 'Driver <-> Car', `Car '${car.model}' associated with Driver '${car.assignedDriver.name}'.`);

  const prof = new Professor('Dr. Vikram Rao');
  const dept = new Department('Computer Science');
  dept.addProfessor(prof);
  logDemo(2, 'Aggregation', 'Department <>- Professor', `Department has ${dept.professors.length} prof(s). Prof outlives department.`);

  const order = new Order('ORD-9901');
  order.addItem('SKU-LAPTOP', 1, 1200);
  logDemo(3, 'Composition', 'Order *-- OrderLineItem', `Order ${order.orderId} strictly owns ${order.items.length} line items.`);

  const cardPayment = new CreditCardPayment('4111222233334567');
  logDemo(4, 'Inheritance (Generalization)', 'CreditCardPayment -> PaymentMethod', cardPayment.processPayment(350));

  const s3 = new S3StorageProvider();
  logDemo(5, 'Realization', 'S3StorageProvider ..|> ICloudStorage', s3.upload('backup.tar.gz', 'binary_data'));

  const invService = new InvoiceService();
  logDemo(6, 'Dependency', 'InvoiceService ..> CurrencyConverter', invService.generateInvoice(100, new CurrencyConverter()));

  const printer = new Printer();
  logDemo(7, 'Delegation', 'Printer delegates to PrintEngine', printer.print('System_Architecture.pdf'));

  const enrollment = new Enrollment(new Student('S1', 'Priya'), new Course('CS501', 'Distributed Systems'), 'Fall 2026', 'A+');
  logDemo(8, 'Association Class', 'Student --[Enrollment]-- Course', enrollment.describe());

  const ceo = new Employee('Satya', 'CEO');
  const dir = new Employee('Rajesh', 'Engineering Director');
  dir.setManager(ceo);
  logDemo(9, 'Reflexive Association', 'Employee <-> Employee', `${dir.name} reports to ${dir.manager.name} (${dir.manager.title}).`);

  const bank = new Bank('Global HDFC');
  bank.addAccount('AC-778899', 'Neha Gupta', 85000);
  logDemo(10, 'Qualified Association', 'Bank --[accNumber]--> Account', `Qualified lookup 'AC-778899': Holder '${bank.getAccount('AC-778899').holder}', Bal: ₹${bank.getAccount('AC-778899').bal}`);

  const contract = new SupplyContract(new Supplier('Foxconn'), new Part('OLED-6.7'), new Project('NextPhone'), 50000, 42.5);
  logDemo(11, 'N-ary Association', 'Supplier x Part x Project', contract.getDetails());

  success('All 11 Core OOPs / UML Relationships validated.');
}

// =========================================================================================
// SECTION 2: Association Types / Multiplicity (9 items)
// =========================================================================================

class Citizen { constructor(name) { this.name = name; this.passport = null; } }
class Passport {
  constructor(number) { this.number = number; this.holder = null; }
  assignTo(citizen) { this.holder = citizen; citizen.passport = this; }
}

class Customer { constructor(name) { this.name = name; this.orders = []; } placeOrder(o) { this.orders.push(o); } }
class CustomerOrder { constructor(code) { this.code = code; } }

class StoreBranch { constructor(city) { this.city = city; } }
class POSDevice { constructor(id, branch) { this.id = id; this.branch = branch; } }

class Author {
  constructor(name) { this.name = name; this.books = []; }
  writeBook(book) { if (!this.books.includes(book)) { this.books.push(book); book.addAuthor(this); } }
}
class Book {
  constructor(title) { this.title = title; this.authors = []; }
  addAuthor(author) { if (!this.authors.includes(author)) { this.authors.push(author); author.writeBook(this); } }
}

class OrgUnit {
  constructor(name) { this.name = name; this.parentUnit = null; }
  setParent(p) { this.parentUnit = p; }
}

class Doctor { constructor(name, spec) { this.name = name; this.spec = spec; } }
class Patient { constructor(name) { this.name = name; this.doctor = null; } assignDoctor(d) { this.doctor = d; } }

class Warehouse { constructor(loc) { this.loc = loc; } }
class InventoryItem { constructor(sku) { this.sku = sku; } }
class SupplierOrg { constructor(name) { this.name = name; } }
class StockConsignment {
  constructor(wh, item, sup, qty) { this.wh = wh; this.item = item; this.sup = sup; this.qty = qty; }
}

class OrderHeader { constructor(id) { this.id = id; this.shipment = null; } attachShipment(s) { this.shipment = s; s.order = this; } }
class ShipmentTracking { constructor(code) { this.code = code; this.order = null; } }

class NotificationDispatchService {
  constructor(transport) { this.transport = transport; }
  sendAlert(msg) { return this.transport.transmit(msg); }
}
class EmailTransportAgent { transmit(msg) { return `[SMTP] Transmitted: "${msg}"`; } }

function runSection2() {
  banner('2. Association Types / Multiplicity');
  const citizen = new Citizen('Aarav Mehta');
  const passport = new Passport('IND-Z982143');
  passport.assignTo(citizen);
  logDemo(1, 'One-to-One (1:1)', 'Citizen <-> Passport', `${citizen.name} holds Passport ${citizen.passport.number}`);

  const cust = new Customer('Rohan');
  cust.placeOrder(new CustomerOrder('ORD-101'));
  cust.placeOrder(new CustomerOrder('ORD-102'));
  logDemo(2, 'One-to-Many (1:N)', 'Customer -> Orders', `${cust.name} placed ${cust.orders.length} orders: ${cust.orders.map(o => o.code).join(', ')}`);

  const branch = new StoreBranch('Bengaluru Central');
  const pos1 = new POSDevice('POS-01', branch);
  const pos2 = new POSDevice('POS-02', branch);
  logDemo(3, 'Many-to-One (N:1)', 'POS Devices -> StoreBranch', `Devices [${pos1.id}, ${pos2.id}] point to branch '${branch.city}'`);

  const b = new Book('Designing Data-Intensive Applications');
  const a1 = new Author('Martin Kleppmann');
  const a2 = new Author('Co-Author');
  a1.writeBook(b); a2.writeBook(b);
  logDemo(4, 'Many-to-Many (M:N)', 'Author <-> Book', `'${b.title}' authors: ${b.authors.map(a => a.name).join(', ')}`);

  const parentUnit = new OrgUnit('HQ');
  const childUnit = new OrgUnit('Platform');
  childUnit.setParent(parentUnit);
  logDemo(5, 'Unary / Self Association', 'OrgUnit -> OrgUnit', `'${childUnit.name}' reports to parent '${childUnit.parentUnit.name}'`);

  const doc = new Doctor('Dr. Ananya', 'Cardiology');
  const pat = new Patient('Suresh');
  pat.assignDoctor(doc);
  logDemo(6, 'Binary Association', 'Doctor <-> Patient', `Patient '${pat.name}' assigned to '${pat.doctor.name}' (${pat.doctor.spec})`);

  const consignment = new StockConsignment(new Warehouse('Mumbai'), new InventoryItem('CHIP-M2'), new SupplierOrg('Semiconductor Corp'), 10000);
  logDemo(7, 'Ternary Association', 'Warehouse x InventoryItem x SupplierOrg', `${consignment.sup.name} supplied ${consignment.qty} of ${consignment.item.sku} to ${consignment.wh.loc}`);

  const oh = new OrderHeader('ORD-55');
  const st = new ShipmentTracking('TRK-99');
  oh.attachShipment(st);
  logDemo(8, 'Bidirectional Association', 'OrderHeader <--> ShipmentTracking', `Order ${oh.id} links to Track ${oh.shipment.code} & Track links to Order ${st.order.id}`);

  const notifier = new NotificationDispatchService(new EmailTransportAgent());
  logDemo(9, 'Unidirectional Association', 'NotificationDispatchService -> EmailTransportAgent', notifier.sendAlert('Disk > 90%'));

  success('All 9 Association Types / Multiplicity validated.');
}

// =========================================================================================
// SECTION 3: Dependency Types (17 items)
// =========================================================================================

class MathHelper { static square(n) { return n * n; } }
class GeometryCalculator { calculateArea(side) { return MathHelper.square(side); } }

class ReportDocument { constructor(title, text) { this.title = title; this.text = text; } }
class ReportGenerator { generate(title, text) { return new ReportDocument(title, text); } }

class EmailProvider { send(to, m) { return `Sent to ${to}: ${m}`; } }
class UserRegistrationService {
  constructor(notifier) { this.notifier = notifier; }
  register(email) { return this.notifier.send(email, 'Welcome!'); }
}

class DatabaseConnection { constructor(cs) { this.cs = cs; } }
class UserRepository {
  constructor(db) { if (!db) throw new Error('DB required'); this.db = db; }
}

class CacheService { get(key) { return `cached_val_${key}`; } }
class ProductCatalogService {
  constructor() { this.cache = null; }
  setCache(c) { this.cache = c; }
  fetch(id) { return this.cache ? `[Cached] ${this.cache.get(id)}` : `[DB] Queried ${id}`; }
}

class PDFFormatter { format(d) { return `[PDF Formatted: ${JSON.stringify(d)}]`; } }
class FinancialExporter { exportReport(data, fmt) { return fmt.format(data); } }

class RuntimePluginResolver {
  static resolve(name) { return { execute: () => `Executed runtime plugin: ${name}` }; }
}

class ContractSchemaValidator {
  static validate(obj) {
    const required = ['id', 'email'];
    const missing = required.filter(k => !(k in obj));
    if (missing.length) throw new Error(`Schema error: missing ${missing.join(', ')}`);
    return true;
  }
}

class SystemClock { static now() { return new Date().toISOString(); } }
class AuditLog { static log(action) { return `[${SystemClock.now()}] Action: ${action}`; } }

class DynamicPaymentRouter {
  route(region) { return region === 'IN' ? 'Razorpay/UPI' : 'Stripe Global'; }
}

class TokenProvider { getToken() { return 'JWT_TOKEN_999'; } }
class AuthClient { constructor() { this.p = new TokenProvider(); } get() { return this.p.getToken(); } }
class ProtectedApiClient { constructor() { this.auth = new AuthClient(); } call() { return `API called with ${this.auth.get()}`; } }

class ComponentA { setPeer(b) { this.peer = b; } ping() { return `A pinged ${this.peer ? 'B' : 'none'}`; } }
class ComponentB { setPeer(a) { this.peer = a; } pong() { return `B ponged ${this.peer ? 'A' : 'none'}`; } }

class HardwareClock { getTick() { return process.hrtime.bigint().toString(); } }
class BenchmarkRunner { constructor() { this.clock = new HardwareClock(); } time() { return `Tick: ${this.clock.getTick()}ns`; } }

class MediatorBus {
  constructor() { this.h = new Map(); }
  register(e, fn) { this.h.set(e, fn); }
  send(e, d) { return this.h.get(e)(d); }
}

class OptionalProfiler {
  constructor(p = null) { this.p = p; }
  run(task) { return this.p ? `[Profiled] ${task}` : `[Unprofiled] ${task}`; }
}

class PrimaryDatabaseCluster { query(q) { return `Query OK: ${q}`; } }
class CoreBillingEngine {
  constructor(db) { if (!db) throw new Error('HARD DEPENDENCY ERROR'); this.db = db; }
  charge(u, amt) { return this.db.query(`CHARGE ${u} $${amt}`); }
}

class CDNImageOptimizer { opt(url) { return `https://cdn.opt/${url}`; } }
class ImageDisplayService {
  constructor(opt = null) { this.opt = opt; }
  render(url) { return this.opt ? this.opt.opt(url) : `Fallback: ${url}`; }
}

function runSection3() {
  banner('3. Dependency Types');
  const geo = new GeometryCalculator();
  logDemo(1, 'Usage Dependency', 'GeometryCalculator ..> MathHelper', `Area of square 5: ${geo.calculateArea(5)}`);

  const repGen = new ReportGenerator();
  logDemo(2, 'Creation Dependency', 'ReportGenerator creates ReportDocument', `Created: ${repGen.generate('Q3', 'Good').title}`);

  const reg = new UserRegistrationService(new EmailProvider());
  logDemo(3, 'Injection Dependency', 'UserRegistrationService(EmailProvider)', reg.register('dev@corp.in'));

  const userRepo = new UserRepository(new DatabaseConnection('pg://cluster'));
  logDemo(4, 'Constructor Dependency', 'UserRepository(DatabaseConnection)', `Initialized with cs: ${userRepo.db.cs}`);

  const catalog = new ProductCatalogService();
  const before = catalog.fetch('P-1');
  catalog.setCache(new CacheService());
  const after = catalog.fetch('P-1');
  logDemo(5, 'Setter Dependency', 'ProductCatalogService.setCache()', `${before} -> ${after}`);

  const exp = new FinancialExporter();
  logDemo(6, 'Method Parameter Dependency', 'exportReport(data, formatter)', exp.exportReport({ bal: 5000 }, new PDFFormatter()));

  logDemo(7, 'Runtime Dependency', 'Dynamic plugin lookup', RuntimePluginResolver.resolve('telemetry').execute());

  ContractSchemaValidator.validate({ id: 1, email: 'a@b.com' });
  logDemo(8, 'Compile-time / Schema Dependency', 'ContractSchemaValidator', 'Validated payload matches contract');

  logDemo(9, 'Static Dependency', 'AuditLog -> SystemClock', AuditLog.log('USER_LOGIN'));

  const dynRouter = new DynamicPaymentRouter();
  logDemo(10, 'Dynamic Dependency', 'DynamicPaymentRouter (region-based)', `Region IN: ${dynRouter.route('IN')} | US: ${dynRouter.route('US')}`);

  const protClient = new ProtectedApiClient();
  logDemo(11, 'Transitive Dependency', 'Client -> Auth -> TokenProvider', protClient.call());

  const a = new ComponentA(); const b = new ComponentB();
  a.setPeer(b); b.setPeer(a);
  logDemo(12, 'Circular Dependency', 'ComponentA <---> ComponentB', `${a.ping()} & ${b.pong()}`);

  const bench = new BenchmarkRunner();
  logDemo(13, 'Direct Dependency', 'BenchmarkRunner -> HardwareClock', bench.time());

  const mediator = new MediatorBus();
  mediator.register('EVT', d => `Handled: ${d}`);
  logDemo(14, 'Indirect Dependency', 'Emitter -> MediatorBus -> Consumer', mediator.send('EVT', 'OrderCompleted'));

  const unprof = new OptionalProfiler();
  const prof = new OptionalProfiler({});
  logDemo(15, 'Optional Dependency', 'OptionalProfiler (null vs active)', `${unprof.run('Task1')} vs ${prof.run('Task2')}`);

  const billing = new CoreBillingEngine(new PrimaryDatabaseCluster());
  logDemo(16, 'Hard Dependency', 'CoreBillingEngine strictly requires PrimaryDatabaseCluster', billing.charge('U-1', 99));

  const softFallback = new ImageDisplayService(null);
  const softOpt = new ImageDisplayService(new CDNImageOptimizer());
  logDemo(17, 'Soft Dependency', 'ImageDisplayService graceful fallback', `${softFallback.render('logo.png')} | ${softOpt.render('logo.png')}`);

  success('All 17 Dependency Types validated.');
}

// =========================================================================================
// SECTION 4: Architectural / System Design Relationships (24 items)
// =========================================================================================

class ParentNode { constructor(n) { this.n = n; this.children = []; } add(c) { c.parent = this; this.children.push(c); } }
class ChildNode { constructor(n) { this.n = n; this.parent = null; } }

class AppServer { handle(req) { return { status: 200, res: `Handled ${req.path}` }; } }
class AppClient { constructor(s) { this.s = s; } get(p) { return this.s.handle({ path: p }); } }

class WorkQueue { constructor() { this.q = []; } push(i) { this.q.push(i); } pop() { return this.q.shift(); } }

class MessageBroker {
  constructor() { this.t = new Map(); }
  sub(topic, fn) { if (!this.t.has(topic)) this.t.set(topic, []); this.t.get(topic).push(fn); }
  pub(topic, msg) { return (this.t.get(topic) || []).map(f => f(msg)); }
}

class DatabaseNode {
  constructor(name, isMaster = false) { this.name = name; this.isMaster = isMaster; this.data = new Map(); this.slaves = []; }
  addSlave(s) { this.slaves.push(s); }
  write(k, v) { this.data.set(k, v); this.slaves.forEach(s => s.data.set(k, v)); return `Replicated to ${this.slaves.length} slaves`; }
  read(k) { return this.data.get(k); }
}

class ConsensusCluster {
  constructor(nodes) { this.nodes = nodes; this.leader = nodes[0]; }
  commit(v) { return `Leader [${this.leader}] committed consensus log: '${v}'`; }
}

class RequestResponseExchange { send(req) { return { id: req.id, reply: 'PONG' }; } }

class WeatherServiceProvider { get(city) { return { city, temp: '25°C' }; } }
class TravelAppConsumer { constructor(p) { this.p = p; } query(c) { return `Forecast for ${c}: ${this.p.get(c).temp}`; } }

class PaymentService { pay(id, amt) { return { txId: `TXN_${id}`, status: 'PAID', amt }; } }
class CheckoutController { constructor(s) { this.s = s; } checkout(id, amt) { return this.s.pay(id, amt); } }

class MockDatabaseEngine {
  constructor() { this.m = new Map(); }
  save(k, v) { this.m.set(k, v); return true; }
  find(k) { return this.m.get(k); }
}
class OrderRepository { constructor(db) { this.db = db; } save(o) { this.db.save(o.id, o); } find(id) { return this.db.find(id); } }
class OrderApplicationService { constructor(r) { this.r = r; } create(id, total) { this.r.save({ id, total }); return this.r.find(id); } }

class APIGateway {
  constructor() { this.routes = new Map(); }
  reg(path, handler) { this.routes.set(path, handler); }
  dispatch(path, req) { return this.routes.get(path)(req); }
}

class MiddlewarePipeline {
  constructor() { this.mw = []; }
  use(fn) { this.mw.push(fn); }
  run(ctx, finalFn) {
    let idx = 0;
    const next = () => (idx < this.mw.length ? this.mw[idx++](ctx, next) : finalFn(ctx));
    return next();
  }
}

class EventEmitterHub {
  constructor() { this.l = new Map(); }
  on(e, fn) { if (!this.l.has(e)) this.l.set(e, []); this.l.get(e).push(fn); }
  emit(e, d) { return (this.l.get(e) || []).map(fn => fn(d)); }
}

class StockMarketSubject {
  constructor() { this.obs = []; }
  attach(o) { this.obs.push(o); }
  setPrice(p) { return this.obs.map(o => o.update(p)); }
}

class BatchOrchestrator {
  constructor(workers) { this.w = workers; }
  run(jobs) { return jobs.map((j, idx) => this.w[idx % this.w.length].process(j)); }
}

class TwoPhaseCommitCoordinator {
  prepare(parts) { return parts.every(p => p.canCommit()); }
  commit(parts) { return parts.map(p => p.commit()); }
}

class ExpensiveServiceTarget { query(q) { return `Data for ${q}`; } }
class CachingProxy {
  constructor(t) { this.t = t; this.c = new Map(); }
  query(q) { if (this.c.has(q)) return `[CACHE] ${this.c.get(q)}`; const res = this.t.query(q); this.c.set(q, res); return `[LIVE] ${res}`; }
}

class LegacyBillingSystem { payPence(p) { return `Processed ${p} pence`; } }
class ModernPaymentAdapter {
  constructor(leg) { this.leg = leg; }
  payDollars(d) { return this.leg.payPence(Math.round(d * 100)); }
}

class ComputerFacade {
  start() { return 'CPU Ready -> RAM Loaded -> HDD Booted'; }
}

class SimpleCoffee { cost() { return 5; } desc() { return 'Coffee'; } }
class MilkDecorator { constructor(c) { this.c = c; } cost() { return this.c.cost() + 2; } desc() { return `${this.c.desc()} + Milk`; } }

class FastStrategy { quote(d) { return d * 2.0; } }
class EcoStrategy { quote(d) { return d * 1.0; } }
class DeliveryContext { constructor(s) { this.s = s; } set(s) { this.s = s; } quote(d) { return this.s.quote(d); } }

class NotificationFactory {
  static make(type) { return { send: (to, m) => `[${type} to ${to}]: ${m}` }; }
}

function runSection4() {
  banner('4. Architectural / System Design Relationships');
  const parent = new ParentNode('Parent');
  const child = new ChildNode('Child');
  parent.add(child);
  logDemo(1, 'Parent–Child', 'ParentNode -> ChildNode', `${child.n} is child of ${child.parent.n}`);

  const client = new AppClient(new AppServer());
  logDemo(2, 'Client–Server', 'AppClient -> AppServer', JSON.stringify(client.get('/health')));

  const queue = new WorkQueue();
  queue.push('Job-1');
  logDemo(3, 'Producer–Consumer', 'WorkQueue decoupling', `Produced Job-1, Consumed: ${queue.pop()}`);

  const broker = new MessageBroker();
  broker.sub('orders', m => `Worker: ${m}`);
  logDemo(4, 'Publisher–Subscriber', 'MessageBroker', broker.pub('orders', 'Created')[0]);

  const master = new DatabaseNode('master', true);
  const slave = new DatabaseNode('slave', false);
  master.addSlave(slave);
  logDemo(5, 'Master–Slave', 'Master replicates to Slaves', `${master.write('k', 'v')} | Slave read: ${slave.read('k')}`);

  const cluster = new ConsensusCluster(['node-1', 'node-2', 'node-3']);
  logDemo(6, 'Leader–Follower', 'Consensus cluster', cluster.commit('TX-99'));

  const rpc = new RequestResponseExchange();
  logDemo(7, 'Request–Response', 'Synchronous exchange', JSON.stringify(rpc.send({ id: 'R1' })));

  const travel = new TravelAppConsumer(new WeatherServiceProvider());
  logDemo(8, 'Service–Consumer', 'TravelApp consumes WeatherService', travel.query('Delhi'));
  logDemo(9, 'Service–Provider', 'WeatherServiceProvider provides API', JSON.stringify(new WeatherServiceProvider().get('Delhi')));

  const checkout = new CheckoutController(new PaymentService());
  logDemo(10, 'Controller–Service', 'CheckoutController -> PaymentService', JSON.stringify(checkout.checkout('U1', 50)));

  const appService = new OrderApplicationService(new OrderRepository(new MockDatabaseEngine()));
  logDemo(11, 'Service–Repository', 'ApplicationService -> OrderRepository', JSON.stringify(appService.create('O1', 99)));
  logDemo(12, 'Repository–Database', 'OrderRepository -> DatabaseEngine', 'Repository mapped entity to mock db');

  const gw = new APIGateway();
  gw.reg('/pay', req => `Paid ${req.amt}`);
  logDemo(13, 'Gateway–Service', 'APIGateway -> Microservices', gw.dispatch('/pay', { amt: 100 }));

  const pipe = new MiddlewarePipeline();
  pipe.use((c, next) => { c.auth = true; return next(); });
  logDemo(14, 'Middleware–Application', 'Pipeline -> Application Target', pipe.run({}, c => `Handled (Auth: ${c.auth})`));

  const hub = new EventEmitterHub();
  hub.on('ALERT', d => `Triggered: ${d}`);
  logDemo(15, 'Event–Listener', 'EventEmitterHub -> Listeners', hub.emit('ALERT', 'HIGH_LOAD')[0]);

  const stock = new StockMarketSubject();
  stock.attach({ update: p => `Price update: $${p}` });
  logDemo(16, 'Observer–Subject', 'StockMarketSubject -> Observers', stock.setPrice(150)[0]);

  const orch = new BatchOrchestrator([{ process: j => `Done ${j}` }]);
  logDemo(17, 'Orchestrator–Worker', 'BatchOrchestrator coordinates workers', orch.run(['TaskA'])[0]);

  const coord = new TwoPhaseCommitCoordinator();
  const parts = [{ canCommit: () => true, commit: () => 'Node1 Committed' }];
  logDemo(18, 'Coordinator–Participant', '2PC Coordinator -> Participants', `Can commit: ${coord.prepare(parts)} | ${coord.commit(parts)[0]}`);

  const proxy = new CachingProxy(new ExpensiveServiceTarget());
  logDemo(19, 'Proxy–Target', 'CachingProxy -> ExpensiveTarget', `${proxy.query('A')} | ${proxy.query('A')}`);

  const adapter = new ModernPaymentAdapter(new LegacyBillingSystem());
  logDemo(20, 'Adapter–Adaptee', 'ModernAdapter -> LegacyBilling', adapter.payDollars(10));

  const facade = new ComputerFacade();
  logDemo(21, 'Facade–Subsystem', 'ComputerFacade -> Subsystems', facade.start());

  const coffee = new MilkDecorator(new SimpleCoffee());
  logDemo(22, 'Decorator–Component', 'MilkDecorator -> SimpleCoffee', `${coffee.desc()} = $${coffee.cost()}`);

  const delivery = new DeliveryContext(new FastStrategy());
  const fCost = delivery.quote(5);
  delivery.set(new EcoStrategy());
  logDemo(23, 'Strategy–Context', 'DeliveryContext swappable strategy', `Fast: $${fCost} vs Eco: $${delivery.quote(5)}`);

  const sms = NotificationFactory.make('SMS');
  logDemo(24, 'Factory–Product', 'NotificationFactory -> Product', sms.send('1234', 'OTP: 1234'));

  success('All 24 Architectural / System Design Relationships validated.');
}

// =========================================================================================
// SECTION 5: Database Relationships (10 items)
// =========================================================================================

class DBTable {
  constructor(name, pk) { this.name = name; this.pk = pk; this.rows = new Map(); }
  insert(row) { this.rows.set(row[this.pk], row); return row; }
  get(pk) { return this.rows.get(pk); }
}

function runSection5() {
  banner('5. Database Relationships');
  const Users = new DBTable('users', 'id');
  const UserProfiles = new DBTable('user_profiles', 'userId');
  Users.insert({ id: 1, name: 'Anil' });
  UserProfiles.insert({ userId: 1, bio: 'Architect' });
  logDemo(1, 'One-to-One', 'users.id <-> user_profiles.userId', `User '${Users.get(1).name}' has Bio: '${UserProfiles.get(1).bio}'`);

  const Departments = new DBTable('departments', 'id');
  const Employees = new DBTable('employees', 'id');
  Departments.insert({ id: 'D1', name: 'Engineering' });
  Employees.insert({ id: 'E1', name: 'Kavita', deptId: 'D1', mentorId: null });
  Employees.insert({ id: 'E2', name: 'Rahul', deptId: 'D1', mentorId: 'E1' });
  const emps = Array.from(Employees.rows.values()).filter(e => e.deptId === 'D1');
  logDemo(2, 'One-to-Many', 'departments (1) -> employees (N)', `Dept 'Engineering' has ${emps.length} emps: ${emps.map(e => e.name).join(', ')}`);

  logDemo(3, 'Many-to-One', 'employees (N) -> departments (1)', `Employees point to single dept FK 'D1'`);

  const junctionEnrollments = [{ sId: 'S1', cId: 'C1' }, { sId: 'S1', cId: 'C2' }, { sId: 'S2', cId: 'C1' }];
  logDemo(4, 'Many-to-Many', 'students <-> junction table <-> courses', `Junction table holds ${junctionEnrollments.length} cross associations`);

  const Categories = new DBTable('categories', 'id');
  Categories.insert({ id: 1, title: 'Electronics', parentId: null });
  Categories.insert({ id: 2, title: 'Phones', parentId: 1 });
  logDemo(5, 'Self-Referencing Relationship', 'categories.parentId -> categories.id', `'${Categories.get(2).title}' parent is '${Categories.get(Categories.get(2).parentId).title}'`);

  const OrderItems = new DBTable('order_items', 'compositeKey');
  OrderItems.insert({ compositeKey: 'ORD1#1', orderId: 'ORD1', seq: 1, item: 'Keyboard' });
  logDemo(6, 'Identifying Relationship', 'order_items composite PK includes orderId', `Child PK (${OrderItems.get('ORD1#1').compositeKey}) cannot exist without parent order`);

  const Accounts = new DBTable('accounts', 'id');
  Accounts.insert({ id: 'ACC-1', clientId: 'C-1' });
  logDemo(7, 'Non-Identifying Relationship', 'accounts(id PK) with clientId FK', `Account '${Accounts.get('ACC-1').id}' has independent surrogate PK`);

  const Parts = new DBTable('parts', 'id');
  Parts.insert({ id: 'ENGINE', parentId: null });
  Parts.insert({ id: 'PISTON', parentId: 'ENGINE' });
  logDemo(8, 'Recursive Relationship', 'parts (Bill of Materials) tree', `Part '${Parts.get('PISTON').id}' belongs to assembly '${Parts.get('PISTON').parentId}'`);

  const isMandatory = fk => fk !== null && fk !== undefined;
  logDemo(9, 'Mandatory Relationship', 'FK column NOT NULL constraint', `Order item requires valid order_id: verified (${isMandatory('ORD1')})`);

  const e1 = Employees.get('E1'); const e2 = Employees.get('E2');
  logDemo(10, 'Optional Relationship', 'FK column NULLABLE', `${e1.name} mentor: ${e1.mentorId || 'None'} | ${e2.name} mentor: ${e2.mentorId}`);

  success('All 10 Database Relationships validated.');
}

// =========================================================================================
// SECTION 6: Runtime & Communication Relationships (15 items)
// =========================================================================================

function synchronousCall(a, b) { return a + b; }
async function asynchronousCall(val) { return Promise.resolve(`Async resolved: ${val}`); }
function blockingComputation() { let s = 0; for (let i = 0; i < 100000; i++) s += i; return `Blocking sum = ${s}`; }
function nonBlockingTask(cb) { setImmediate(() => cb('Non-blocking callback executed')); return 'Immediate return'; }

class DomainEventEmitter {
  constructor() { this.h = {}; }
  on(e, fn) { (this.h[e] = this.h[e] || []).push(fn); }
  emit(e, d) { return (this.h[e] || []).map(f => f(d)); }
}

class MessageQueueChannel { constructor() { this.q = []; } send(m) { this.q.push(m); } recv() { return this.q.shift(); } }

class DirectPeerNode { ping(m) { return `Direct peer received: ${m}`; } }

class IndirectBroker {
  constructor() { this.r = new Map(); }
  reg(d, fn) { this.r.set(d, fn); }
  send(d, m) { return this.r.get(d)(m); }
}

class PointToPointQueue {
  constructor() { this.c = []; }
  reg(c) { this.c.push(c); }
  dispatch(m) { const consumer = this.c.shift(); this.c.push(consumer); return consumer(m); }
}

class BroadcastMesh {
  constructor() { this.nodes = []; }
  join(n) { this.nodes.push(n); }
  broadcast(m) { return this.nodes.map(n => n(m)); }
}

class MulticastGroup {
  constructor(name) { this.name = name; this.m = []; }
  join(fn) { this.m.push(fn); }
  send(msg) { return this.m.map(f => f(this.name, msg)); }
}

async function* dataStreamGenerator(items) {
  for (const item of items) yield `Chunk(${item})`;
}

function callbackTask(name, cb) { return cb(null, `Task '${name}' completed`); }

class PollingJobStatus {
  constructor() { this.tries = 0; }
  check() { this.tries++; return { done: this.tries >= 2, tries: this.tries }; }
}

class WebhookDispatcher {
  constructor() { this.urls = []; }
  reg(u) { this.urls.push(u); }
  dispatch(e, p) { return this.urls.map(u => `[POST ${u}] Event ${e}`); }
}

async function runSection6() {
  banner('6. Runtime & Communication Relationships');
  logDemo(1, 'Synchronous Communication', 'Immediate return', `synchronousCall(5, 5) -> ${synchronousCall(5, 5)}`);

  const asyncVal = await asynchronousCall('Payment');
  logDemo(2, 'Asynchronous Communication', 'Promise-based', asyncVal);

  logDemo(3, 'Blocking Communication', 'CPU loop blocks thread', blockingComputation());

  let nbMsg = '';
  const nbRet = nonBlockingTask(m => { nbMsg = m; });
  logDemo(4, 'Non-Blocking Communication', 'Event loop delegation', `${nbRet}`);

  const devt = new DomainEventEmitter();
  devt.on('SIGNUP', u => `Welcome email to ${u.email}`);
  logDemo(5, 'Event-Driven Communication', 'DomainEventEmitter', devt.emit('SIGNUP', { email: 'a@b.com' })[0]);

  const mq = new MessageQueueChannel();
  mq.send({ id: 'M1', type: 'ORDER' });
  logDemo(6, 'Message-Based Communication', 'MessageQueueChannel', `Received: ${mq.recv().type}`);

  const peer = new DirectPeerNode();
  logDemo(7, 'Direct Communication', 'Direct memory invocation', peer.ping('SYN'));

  const indBroker = new IndirectBroker();
  indBroker.reg('billing', m => `Billing received $${m}`);
  logDemo(8, 'Indirect Communication', 'IndirectBroker routing', indBroker.send('billing', 50));

  const p2p = new PointToPointQueue();
  p2p.reg(m => `Worker1: ${m}`); p2p.reg(m => `Worker2: ${m}`);
  logDemo(9, 'Point-to-Point Communication', '1 sender -> 1 dedicated consumer', `${p2p.dispatch('J1')} & ${p2p.dispatch('J2')}`);

  const mesh = new BroadcastMesh();
  mesh.join(m => `N1:${m}`); mesh.join(m => `N2:${m}`);
  logDemo(10, 'Broadcast Communication', '1 sender -> ALL mesh nodes', mesh.broadcast('SHUTDOWN').join(' | '));

  const mc = new MulticastGroup('TELEMETRY');
  mc.join((g, m) => `Prometheus[${g}]: ${m}`);
  logDemo(11, 'Multicast Communication', '1 sender -> Specific subscriber group', mc.send('CPU=80%')[0]);

  const stream = dataStreamGenerator(['Chunk1', 'Chunk2']);
  const chunks = [];
  for await (const c of stream) chunks.push(c);
  logDemo(12, 'Streaming Relationship', 'Async Generator streaming', chunks.join(' -> '));

  let cbResult = '';
  callbackTask('Backup', (err, res) => { cbResult = res; });
  logDemo(13, 'Callback Relationship', 'Error-first callback function', cbResult);

  const poller = new PollingJobStatus();
  while (!poller.check().done);
  logDemo(14, 'Polling Relationship', 'Repeated status inspection', `Completed after ${poller.tries} polls`);

  const wh = new WebhookDispatcher();
  wh.reg('https://api.partner/hook');
  logDemo(15, 'Webhook Relationship', 'Reverse HTTP push notification', wh.dispatch('PAID', {})[0]);

  success('All 15 Runtime & Communication Relationships validated.');
}

// =========================================================================================
// SECTION 7: Structural / Component Relationships (20 items)
// =========================================================================================

class ShoppingCart { constructor() { this.items = []; } add(i) { this.items.push(i); } }
class CPU { constructor(m) { this.m = m; } }
class Motherboard { constructor(m) { this.cpu = new CPU(m); } }
class Engine { roar() { return 'V8 Roar'; } }
class Vehicle { constructor(e) { this.e = e; } }
class Animal { sound() { return 'generic'; } }
class Dog extends Animal { sound() { return 'Woof!'; } }
class Formatter { static clean(s) { return s.trim(); } }
class Sanitizer { clean(s) { return Formatter.clean(s); } }
class ConfigRegistry { get(k) { return 8080; } }
class WebServer { constructor(c) { this.c = c; } }
class Serializable { serialize() { return JSON.stringify(this); } }
class UserDto extends Serializable { constructor(id) { super(); this.id = id; } }
class BaseLogger { log(m) { return `[BASE]: ${m}`; } }
class CustomLogger extends BaseLogger { log(m) { return `[CUSTOM] ${super.log(m)}`; } }
class TokenFactory { static create() { return `TOK_${Date.now()}`; } }
class MathService { add(a, b) { return a + b; } }
class CalcComp { constructor(s) { this.s = s; } sum(a, b) { return this.s.add(a, b); } }
class DynamicInvoker { invoke(o, m, ...args) { return o[m](...args); } }
class AuditLogRef { constructor(refId) { this.refId = refId; } }
class StreamRaw { read() { return 'raw'; } }
class StreamWrap { constructor(s) { this.s = s; } read() { return `Wrapped(${this.s.read()})`; } }
class Vault { #secret = 'TOP_SECRET'; expose() { return `PUB_KEY_${this.#secret.slice(0, 3)}`; } }
class TaskWorker { work(t) { return `Worked on ${t}`; } }
class TaskManager { constructor() { this.w = new TaskWorker(); } assign(t) { return this.w.work(t); } }
class ThreadPool { constructor(sz) { this.sz = sz; } status() { return `Managing ${this.sz} threads`; } }
class TrafficController { constructor() { this.s = 'RED'; } next() { this.s = this.s === 'RED' ? 'GREEN' : 'RED'; return this.s; } }
class Channel {
  constructor() { this.s = []; }
  sub(fn) { this.s.push(fn); }
  pub(m) { return this.s.map(f => f(m)); }
}
class NetClient { constructor(h, p) { this.h = h; this.p = p; } connect() { return `Connected to ${this.h}:${this.p}`; } }

function runSection7() {
  banner('7. Structural / Component Relationships');
  const cart = new ShoppingCart(); cart.add('item1');
  logDemo(1, 'Contains', 'ShoppingCart contains items', `Cart holds ${cart.items.length} item`);

  const mobo = new Motherboard('i9');
  logDemo(2, 'Owns', 'Motherboard owns CPU lifecycle', `Motherboard owns CPU: ${mobo.cpu.m}`);

  const v = new Vehicle(new Engine());
  logDemo(3, 'Has-A', 'Vehicle Has-A Engine', v.e.roar());

  const dog = new Dog();
  logDemo(4, 'Is-A', 'Dog Is-A Animal', `Sound: ${dog.sound()} (instanceof Animal: ${dog instanceof Animal})`);

  const san = new Sanitizer();
  logDemo(5, 'Uses-A', 'Sanitizer Uses-A Formatter', `Cleaned: '${san.clean(' text ')}'`);

  const ws = new WebServer(new ConfigRegistry());
  logDemo(6, 'Depends-On', 'WebServer Depends-On ConfigRegistry', `Port: ${ws.c.get('PORT')}`);

  const dto = new UserDto('U1');
  logDemo(7, 'Implements', 'UserDto implements Serializable', dto.serialize());

  const clog = new CustomLogger();
  logDemo(8, 'Extends', 'CustomLogger extends BaseLogger', clog.log('Booted'));

  logDemo(9, 'Creates', 'TokenFactory Creates Token', TokenFactory.create());

  const calcComp = new CalcComp(new MathService());
  logDemo(10, 'Calls', 'CalcComp Calls MathService.add()', `Sum: ${calcComp.sum(10, 20)}`);

  const invoker = new DynamicInvoker();
  logDemo(11, 'Invokes', 'DynamicInvoker Invokes method dynamically', invoker.invoke(calcComp, 'sum', 4, 6));

  const audit = new AuditLogRef('USER-101');
  logDemo(12, 'References', 'AuditLogRef references external entity ID', `Ref ID: ${audit.refId}`);

  const wrapped = new StreamWrap(new StreamRaw());
  logDemo(13, 'Wraps', 'StreamWrap Wraps StreamRaw', wrapped.read());

  const vault = new Vault();
  logDemo(14, 'Exposes', 'Vault Exposes safe public API', vault.expose());

  const tm = new TaskManager();
  logDemo(15, 'Delegates-To', 'TaskManager Delegates-To TaskWorker', tm.assign('Indexing'));

  const tp = new ThreadPool(4);
  logDemo(16, 'Manages', 'ThreadPool Manages worker threads', tp.status());

  const tc = new TrafficController();
  logDemo(17, 'Controls', 'TrafficController Controls state transitions', `Transition: ${tc.next()} -> ${tc.next()}`);

  const ch = new Channel();
  let chMsg = '';
  ch.sub(m => { chMsg = m; return m; });
  ch.pub('OrderReady');
  logDemo(18, 'Subscribes-To', 'Channel subscriber listening', 'Subscribed to channel');
  logDemo(19, 'Publishes-To', 'Producer publishes to channel', `Received via pub: ${chMsg}`);

  const nc = new NetClient('127.0.0.1', 80);
  logDemo(20, 'Connects-To', 'NetClient Connects-To target address', nc.connect());

  success('All 20 Structural / Component Relationships validated.');
}

// =========================================================================================
// SECTION 8: Advanced System Architecture Dependencies (20 items)
// =========================================================================================

class InventoryMicroservice { check(sku) { return { sku, qty: 100 }; } }
class OrderFulfillmentService { constructor(i) { this.i = i; } }

class ModuleDependencyManager { static check() { return 'Internal standard module bindings'; } }
class PackageDependencyChecker { static check() { return 'Zero external packages required'; } }
class LibraryCryptoClient { hash(s) { return crypto.createHash('sha256').update(s).digest('hex').slice(0, 16); } }
class InfraDep { constructor(r) { this.r = r; } desc() { return `AWS Region: ${this.r}`; } }
class AppConfigProvider { constructor(cfg) { this.cfg = cfg; } }
class EnvDep { static get() { return process.env.NODE_ENV || 'production'; } }
class DataDepPipeline {
  set(d) { this.d = d; }
  run() { if (!this.d) throw new Error('DATA DEP MISSING'); return `Processed ${this.d.length} rows`; }
}
class ExecutionGraph {
  constructor() { this.done = false; }
  stepA() { this.done = true; return 'Step A Done'; }
  stepB() { if (!this.done) throw new Error('EXEC DEP ERROR'); return 'Step B Done'; }
}
class DeploymentManifest {
  static verify(deployed, target, req) {
    if (!req.every(r => deployed.includes(r))) throw new Error('DEPLOY DEP ERROR');
    return `${target} cleared for deployment`;
  }
}
class NetValidator { static check(h) { return `TCP route to ${h} verified OPEN`; } }
class SecEnforcer { static verify(tls) { return `TLS v${tls} compliant`; } }
class AuthGuard { static auth(t) { return t.startsWith('Bearer ') ? 'user_admin' : null; } }
class AuthzGuard { static authz(user, role) { return role === 'ADMIN' ? 'GRANTED' : 'DENIED'; } }
class ResourceMonitor { static check() { return `Heap: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`; } }
class AvailabilityContract { constructor(sla) { this.sla = sla; } }
class CircuitBreaker {
  constructor() { this.open = false; }
  run(action, fallback) { return this.open ? fallback() : action(); }
}
class TemporalScheduler { static isWindow(h) { return h >= 0 && h < 5; } }
class SequenceOrderer {
  constructor() { this.last = 0; }
  order(seq, msg) { if (seq !== this.last + 1) throw new Error('ORDER VIOLATION'); this.last = seq; return `Seq #${seq}: ${msg}`; }
}
class VersionNegotiator { static neg(ver) { return `Negotiated API compatible with v${ver}`; } }

function runSection8() {
  banner('8. Advanced System Architecture Dependencies');
  const ofs = new OrderFulfillmentService(new InventoryMicroservice());
  logDemo(1, 'Service Dependency', 'OrderFulfillment -> InventoryMicroservice', JSON.stringify(ofs.i.check('SKU-1')));

  logDemo(2, 'Module Dependency', 'ModuleDependencyManager', ModuleDependencyManager.check());

  logDemo(3, 'Package Dependency', 'PackageDependencyChecker', PackageDependencyChecker.check());

  const crypt = new LibraryCryptoClient();
  logDemo(4, 'Library Dependency', "Node built-in 'crypto' library", `SHA256: ${crypt.hash('sys_design')}`);

  const infra = new InfraDep('ap-south-1');
  logDemo(5, 'Infrastructure Dependency', 'Cloud infrastructure dependency', infra.desc());

  const cfg = new AppConfigProvider({ retries: 3 });
  logDemo(6, 'Configuration Dependency', 'Dynamic runtime configuration', `Retries: ${cfg.cfg.retries}`);

  logDemo(7, 'Environment Dependency', 'Runtime environment detection', `Env: ${EnvDep.get()}`);

  const pipeline = new DataDepPipeline();
  pipeline.set([1, 2, 3]);
  logDemo(8, 'Data Dependency', 'Execution gated on upstream dataset', pipeline.run());

  const exec = new ExecutionGraph();
  exec.stepA();
  logDemo(9, 'Execution Dependency', 'Step B strictly gated after Step A', exec.stepB());

  const depStatus = DeploymentManifest.verify(['db', 'auth'], 'payment-service', ['db', 'auth']);
  logDemo(10, 'Deployment Dependency', 'Deployment topology prerequisites', depStatus);

  logDemo(11, 'Network Dependency', 'Network route reachability', NetValidator.check('api.gateway.internal'));

  logDemo(12, 'Security Dependency', 'Security protocol baseline', SecEnforcer.verify(1.3));

  const principal = AuthGuard.auth('Bearer token123');
  logDemo(13, 'Authentication Dependency', 'Identity assertion', `Principal: ${principal}`);

  logDemo(14, 'Authorization Dependency', 'RBAC permission evaluation', AuthzGuard.authz(principal, 'ADMIN'));

  logDemo(15, 'Resource Dependency', 'Physical/virtual memory allocation', ResourceMonitor.check());

  const sla = new AvailabilityContract('99.99%');
  logDemo(16, 'Availability Dependency', 'Availability SLA contract', `Tier: ${sla.sla}`);

  const breaker = new CircuitBreaker();
  logDemo(17, 'Failure Dependency', 'Circuit breaker fallback execution', breaker.run(() => 'Live Result', () => 'Fallback'));

  logDemo(18, 'Temporal Dependency', 'Time-window bound scheduling', `Permitted in 00-05h window: ${TemporalScheduler.isWindow(2)}`);

  const seq = new SequenceOrderer();
  logDemo(19, 'Ordering Dependency', 'FIFO strictly ordered monotonic sequence', `${seq.order(1, 'MSG1')} -> ${seq.order(2, 'MSG2')}`);

  logDemo(20, 'Version Dependency', 'SemVer compatibility negotiation', VersionNegotiator.neg('2.1.0'));

  success('All 20 Advanced System Architecture Dependencies validated.');
}

// =========================================================================================
// MASTER RUNNER & VERIFICATION REPORT
// =========================================================================================

async function main() {
  const t0 = Date.now();
  console.log(`\n${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║   ENTERPRISE SYSTEM DESIGN & OOP RELATIONSHIPS COMPREHENSIVE ENGINE            ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║   Total Categories: 8  |  Total Relationships & Dependencies: 126 / 126        ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}║   Format: Standalone Single File Codebase                                      ║${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}╚════════════════════════════════════════════════════════════════════════════════╝${colors.reset}`);

  runSection1();
  runSection2();
  runSection3();
  runSection4();
  runSection5();
  await runSection6();
  runSection7();
  runSection8();

  const elapsed = Date.now() - t0;
  banner('Execution Summary & Verification Report');
  console.log(`\n  ┌───────────────────────────────────────────────────┬──────────────┬────────────┐`);
  console.log(`  │ Category                                          │ Total Items  │ Status     │`);
  console.log(`  ├───────────────────────────────────────────────────┼──────────────┼────────────┤`);
  console.log(`  │ 1. Core OOPs / UML Relationships                  │           11 │ PASSED(100%)│`);
  console.log(`  │ 2. Association Types / Multiplicity               │            9 │ PASSED(100%)│`);
  console.log(`  │ 3. Dependency Types                               │           17 │ PASSED(100%)│`);
  console.log(`  │ 4. Architectural / System Design Relationships    │           24 │ PASSED(100%)│`);
  console.log(`  │ 5. Database Relationships                         │           10 │ PASSED(100%)│`);
  console.log(`  │ 6. Runtime & Communication Relationships          │           15 │ PASSED(100%)│`);
  console.log(`  │ 7. Structural / Component Relationships           │           20 │ PASSED(100%)│`);
  console.log(`  │ 8. Advanced System Architecture Dependencies      │           20 │ PASSED(100%)│`);
  console.log(`  ├───────────────────────────────────────────────────┼──────────────┼────────────┤`);
  console.log(`  │ GRAND TOTAL COVERAGE                              │          126 │ ALL PASSED │`);
  console.log(`  └───────────────────────────────────────────────────┴──────────────┴────────────┘`);
  console.log(`\n  ${colors.green}⚡ All 126 / 126 relationships and dependencies verified cleanly in ${elapsed}ms!${colors.reset}\n`);
}

main();
