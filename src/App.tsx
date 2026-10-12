import { FormEvent, ReactNode, useMemo, useState } from "react";

type IconName =
  | "calendar"
  | "cart"
  | "check"
  | "chevron"
  | "close"
  | "home"
  | "leaf"
  | "minus"
  | "pantry"
  | "plus"
  | "receipt"
  | "spark"
  | "wallet";

type Meal = {
  id: number;
  day: string;
  name: string;
  meta: string;
  cost: number;
  tone: string;
  icon: IconName;
};

type GroceryItem = {
  id: number;
  name: string;
  detail: string;
  price: number;
  checked: boolean;
  owned?: boolean;
};

type FoodLog = {
  id: number;
  day: number;
  name: string;
  type: string;
  calories: number;
  cost: number;
  time: string;
};

const initialMeals: Meal[] = [
  { id: 1, day: "MON", name: "Bibimbap bowls", meta: "Dinner · 2 servings", cost: 8500, tone: "bg-[#FFF0E7] text-[#A45E32]", icon: "leaf" },
  { id: 2, day: "TUE", name: "Egg fried rice", meta: "Dinner · 2 servings", cost: 4800, tone: "bg-[#F1F4E8] text-[#66783A]", icon: "spark" },
  { id: 3, day: "WED", name: "Tomato pasta", meta: "Dinner · 2 servings", cost: 7200, tone: "bg-[#F8E8E5] text-[#9A544B]", icon: "cart" },
  { id: 4, day: "THU", name: "Leftovers", meta: "Dinner · From Wednesday", cost: 0, tone: "bg-[#EDF1F1] text-[#637374]", icon: "receipt" },
];

const initialGroceries: GroceryItem[] = [
  { id: 1, name: "Short-grain rice", detail: "1 kg", price: 6500, checked: false },
  { id: 2, name: "Eggs", detail: "10 pack", price: 4200, checked: true },
  { id: 3, name: "Spinach", detail: "1 bunch", price: 2800, checked: false },
  { id: 4, name: "Ground beef", detail: "300 g", price: 5800, checked: false },
  { id: 5, name: "Pasta", detail: "500 g", price: 2400, checked: false },
  { id: 6, name: "Soy sauce", detail: "Pantry", price: 0, checked: true, owned: true },
];

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 10.5 9-7.5 9 7.5" /><path d="M5 9.5V21h14V9.5M9 21v-7h6v7" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    cart: <><path d="M3 4h2l2.3 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    pantry: <><path d="M5 3h14v18H5zM5 9h14M12 5v2M12 11v3" /></>,
    receipt: <><path d="M6 3v18l3-2 3 2 3-2 3 2V3l-3 2-3-2-3 2-3-2Z" /><path d="M9 10h6M9 14h5" /></>,
    wallet: <><path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12v3" /><path d="M15 11h5v4h-5a2 2 0 0 1 0-4Z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    leaf: <><path d="M20 4C12 4 6 8 6 14c0 2 1 4 3 5 6-1 10-6 11-15Z" /><path d="M4 21c2-5 6-9 12-12" /></>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z" /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" /></>,
  };
  return <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const styles = {
    primary: "bg-[#245C43] text-white shadow-sm hover:bg-[#194A35]",
    secondary: "border border-[#D8DDD5] bg-white text-[#26322B] hover:bg-[#F7F8F5]",
    ghost: "text-[#536158] hover:bg-[#EEF1EC]",
  };
  return <button type={type} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${styles[variant]} ${className}`}>{children}</button>;
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#142019]/45 p-0 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={onClose}>
      <section className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-[#17251D]">{title}</h2>
          <button aria-label="Close dialog" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-[#F2F4F0] text-[#68736B] hover:bg-[#E5E9E2]"><Icon name="close" /></button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-bold text-[#3F4B43]">{label}</span>{children}</label>;
}

function formatWon(value: number) {
  return `₩${Math.max(0, value).toLocaleString()}`;
}

export default function App() {
  const [budget, setBudget] = useState(70000);
  const [dailyBudget, setDailyBudget] = useState(10000);
  const [spent, setSpent] = useState(18200);
  const [meals, setMeals] = useState(initialMeals);
  const [groceries, setGroceries] = useState(initialGroceries);
  const [modal, setModal] = useState<"budget" | "meal" | "spending" | "foodLog" | null>(null);
  const [activeView, setActiveView] = useState<"overview" | "calendar">("overview");
  const [selectedDay, setSelectedDay] = useState(15);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([
    { id: 1, day: 15, name: "Banana oatmeal", type: "Breakfast", calories: 410, cost: 2200, time: "8:10 AM" },
    { id: 2, day: 15, name: "Chicken rice bowl", type: "Lunch", calories: 620, cost: 4800, time: "12:35 PM" },
    { id: 3, day: 15, name: "Greek yogurt", type: "Snack", calories: 180, cost: 1800, time: "3:40 PM" },
    { id: 4, day: 14, name: "Egg fried rice", type: "Dinner", calories: 710, cost: 4200, time: "7:15 PM" },
  ]);
  const [showSetup, setShowSetup] = useState(true);
  const [calorieTarget, setCalorieTarget] = useState<number | null>(null);
  const [goalLabel, setGoalLabel] = useState("Maintain weight");
  const [notice, setNotice] = useState("");

  const planned = useMemo(() => groceries.reduce((sum, item) => sum + (item.owned ? 0 : item.price), 0), [groceries]);
  const remaining = budget - spent;
  const progress = Math.min(100, Math.round((spent / budget) * 100));

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  }

  function addMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("meal"));
    const day = String(data.get("day"));
    const ingredients = String(data.get("ingredients")).split(",").map((item) => item.trim()).filter(Boolean);
    const cost = Number(data.get("cost")) || 0;

    setMeals((current) => [...current, { id: Date.now(), day, name, meta: "Dinner · 2 servings", cost, tone: "bg-[#EEEAF7] text-[#6D568D]", icon: "leaf" }]);
    setGroceries((current) => {
      const names = new Set(current.map((item) => item.name.toLowerCase()));
      const additions = ingredients
        .filter((ingredient) => !names.has(ingredient.toLowerCase()))
        .map((ingredient, index) => ({ id: Date.now() + index, name: ingredient, detail: "1 item", price: 0, checked: false }));
      return [...current, ...additions];
    });
    setModal(null);
    flash("Meal added and grocery list updated");
  }

  function updateBudget(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(new FormData(event.currentTarget).get("budget"));
    if (value > 0) {
      setBudget(value);
      setDailyBudget(Math.round(value / 7));
    }
    setModal(null);
    flash("Weekly budget updated");
  }

  function updateSpending(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(new FormData(event.currentTarget).get("spent"));
    if (value >= 0) setSpent(value);
    setModal(null);
    flash("Actual spending recorded");
  }

  function addFoodLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const entry: FoodLog = {
      id: Date.now(),
      day: selectedDay,
      name: String(data.get("name")),
      type: String(data.get("type")),
      calories: Number(data.get("calories")) || 0,
      cost: Number(data.get("cost")) || 0,
      time: String(data.get("time")) || "Just now",
    };
    setFoodLogs((current) => [...current, entry]);
    setSpent((current) => current + entry.cost);
    setModal(null);
    flash(`${entry.type} added to May ${selectedDay}`);
  }

  function calculateNeeds(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const age = Number(data.get("age"));
    const height = Number(data.get("height"));
    const weight = Number(data.get("weight"));
    const sexAdjustment = data.get("sex") === "male" ? 5 : -161;
    const activity = Number(data.get("activity"));
    const goal = String(data.get("goal"));
    const chosenDailyBudget = Number(data.get("dailyBudget"));
    const goalAdjustment = goal === "lose" ? -300 : goal === "gain" ? 250 : 0;
    const estimated = Math.round((10 * weight + 6.25 * height - 5 * age + sexAdjustment) * activity + goalAdjustment);

    setCalorieTarget(Math.max(1200, estimated));
    setGoalLabel(goal === "lose" ? "Gradual weight loss" : goal === "gain" ? "Gradual weight gain" : "Maintain weight");
    if (chosenDailyBudget > 0) {
      setDailyBudget(chosenDailyBudget);
      setBudget(chosenDailyBudget * 7);
    }
    setShowSetup(false);
    flash("Your daily meal guide is ready");
  }

  const mealGuide = calorieTarget
    ? [
        { name: "Breakfast", share: 0.25, suggestion: "Oats, banana & eggs" },
        { name: "Lunch", share: 0.3, suggestion: "Rice bowl with vegetables" },
        { name: "Dinner", share: 0.35, suggestion: "Protein, grains & greens" },
        { name: "Snack", share: 0.1, suggestion: "Fruit or yogurt" },
      ]
    : [];

  return (
    <div className="phone-app mx-auto min-h-screen max-w-md bg-[#F5F6F2] text-[#1B2921] shadow-[0_0_60px_rgba(27,41,33,0.12)]">
      <header className="sticky top-0 z-30 border-b border-[#E1E4DE] bg-[#FDFEFB]/95 backdrop-blur">
        <div className="flex h-17 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-[#245C43] text-white"><Icon name="leaf" className="size-5" /></div>
            <span className="text-lg font-extrabold tracking-[-0.03em]">MealBudget</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-semibold text-[#667169] sm:block">May 13–19</span>
            <button aria-label="Open profile" className="grid size-9 place-items-center rounded-full bg-[#E6D2B8] text-sm font-extrabold text-[#624A31]">SK</button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden">
          <nav className="space-y-1">
            {[["home", "Overview"], ["calendar", "Meal plan"], ["cart", "Grocery list"], ["pantry", "My pantry"], ["receipt", "Spending"]].map(([icon, label], index) => (
              <button key={label} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${index === 0 ? "bg-[#E6EFE8] text-[#245C43]" : "text-[#637068] hover:bg-[#F0F2EE]"}`}>
                <Icon name={icon as IconName} className="size-5" />{label}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl bg-[#EDF2E9] p-4">
            <Icon name="spark" className="mb-3 size-5 text-[#477048]" />
            <p className="text-sm font-extrabold">You’re on track</p>
            <p className="mt-1 text-xs leading-relaxed text-[#647067]">Your plan leaves a comfortable {formatWon(remaining - planned)} buffer.</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-28 pt-6">
          <div className={activeView === "overview" ? "block" : "hidden"}>
            <div className="mb-6 flex items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-sm font-bold text-[#718076]">WEEKLY OVERVIEW</p>
                <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#17251D]">Good morning, Soo</h1>
                <p className="mt-1 text-sm text-[#69746D]">Your week is looking good.</p>
              </div>
              <Button className="!size-11 !shrink-0 !rounded-full !p-0" onClick={() => setModal("meal")}><Icon name="plus" /></Button>
            </div>

            <section className="mb-4 overflow-hidden rounded-3xl bg-[#214F3B] text-white shadow-[0_16px_40px_rgba(28,65,48,0.16)]">
              <div>
                <div className="p-6">
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#CDE1D2]"><Icon name="wallet" className="size-5" /> Weekly food budget</div>
                    <Button variant="ghost" className="!bg-white/10 !px-3 !py-2 !text-white hover:!bg-white/15" onClick={() => setModal("budget")}>Edit</Button>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#BBD2C2]">Remaining</p>
                      <p className="mt-1 text-4xl font-extrabold tracking-[-0.04em]">{formatWon(remaining)}</p>
                    </div>
                    <p className="pb-1 text-sm font-semibold text-[#BBD2C2]">of {formatWon(budget)}</p>
                  </div>
                  <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/15">
                    <div className="h-full rounded-full bg-[#E7C774] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex justify-between text-xs font-semibold text-[#BBD2C2]"><span>{progress}% spent</span><span>{100 - progress}% left</span></div>
                </div>
                <div className="grid grid-cols-2 border-t border-white/10 bg-[#1A4433]">
                  <div className="border-r border-white/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#AFC8B7]">Spent</p>
                    <p className="mt-2 text-2xl font-extrabold">{formatWon(spent)}</p>
                    <button onClick={() => setModal("spending")} className="mt-5 text-xs font-bold text-[#F0D58B] hover:underline">Update actual</button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#AFC8B7]">Planned</p>
                    <p className="mt-2 text-2xl font-extrabold">{formatWon(planned)}</p>
                    <p className="mt-5 text-xs font-semibold text-[#AFC8B7]">Estimated cost</p>
                  </div>
                </div>
              </div>
            </section>

            {calorieTarget && (
              <section className="mb-4 rounded-3xl border border-[#E1E4DE] bg-white p-5">
                <div className="mb-5 flex flex-col gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="grid size-9 place-items-center rounded-xl bg-[#EAF2E8] text-[#356049]"><Icon name="spark" className="size-4" /></div>
                      <div>
                        <h2 className="text-lg font-extrabold tracking-tight">Your daily meal guide</h2>
                        <p className="text-sm text-[#7A847D]">{goalLabel} · Estimated target</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl bg-[#F3F6F1] px-4 py-3">
                    <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A867E]">Daily target</p><p className="font-extrabold">{calorieTarget.toLocaleString()} kcal</p></div>
                    <div className="h-8 w-px bg-[#D9DFD7]" />
                    <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A867E]">Daily budget</p><p className="font-extrabold">{formatWon(dailyBudget)}</p></div>
                    <button aria-label="Recalculate needs" onClick={() => setShowSetup(true)} className="ml-1 text-xs font-extrabold text-[#356049] hover:underline">Edit</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mealGuide.map((guide, index) => (
                    <article key={guide.name} className="rounded-2xl border border-[#E6E9E3] bg-[#FAFBF8] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#6D796F]">{guide.name}</span>
                        <span className={`grid size-7 place-items-center rounded-lg text-xs font-extrabold ${["bg-[#F8E8DE] text-[#965E39]", "bg-[#E8F0E6] text-[#527048]", "bg-[#ECE9F4] text-[#6E5A89]", "bg-[#E8EFF3] text-[#536F7C]"][index]}`}>{index + 1}</span>
                      </div>
                      <p className="font-extrabold">{Math.round(calorieTarget * guide.share).toLocaleString()} kcal</p>
                      <p className="mt-1 text-xs leading-relaxed text-[#7A847D]">{guide.suggestion}</p>
                    </article>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-[#8A938C]">This is a general planning estimate, not medical advice. Calorie needs vary; consult a qualified professional for personalized nutrition guidance.</p>
              </section>
            )}

            <div className="grid gap-4">
              <section className="rounded-3xl border border-[#E1E4DE] bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div><h2 className="text-lg font-extrabold tracking-tight">This week’s meals</h2><p className="mt-1 text-sm text-[#7A847D]">{meals.length} meals planned</p></div>
                  <Button variant="ghost" className="!px-2.5" onClick={() => setActiveView("calendar")}>View calendar <Icon name="chevron" className="size-4" /></Button>
                </div>
                <div className="space-y-2">
                  {meals.slice(0, 5).map((meal) => (
                    <article key={meal.id} className="group flex items-center gap-3 rounded-2xl border border-transparent p-2 transition hover:border-[#E3E7E0] hover:bg-[#FAFBF8]">
                      <div className="w-10 shrink-0 text-center text-[11px] font-extrabold tracking-wider text-[#7A867E]">{meal.day}</div>
                      <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${meal.tone}`}><Icon name={meal.icon} className="size-5" /></div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{meal.name}</p><p className="mt-1 truncate text-xs text-[#7B857E]">{meal.meta}</p></div>
                      <p className="text-sm font-bold text-[#4D5951]">{meal.cost ? formatWon(meal.cost) : "—"}</p>
                    </article>
                  ))}
                  <button onClick={() => setModal("meal")} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD3CA] py-3 text-sm font-bold text-[#52705E] transition hover:border-[#819D89] hover:bg-[#F5F8F3]"><Icon name="plus" className="size-4" /> Plan another meal</button>
                </div>
              </section>

              <section className="rounded-3xl border border-[#E1E4DE] bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div><h2 className="text-lg font-extrabold tracking-tight">Grocery list</h2><p className="mt-1 text-sm text-[#7A847D]">{groceries.filter((item) => !item.checked).length} items to get</p></div>
                  <div className="grid size-10 place-items-center rounded-xl bg-[#EDF3EB] text-[#356049]"><Icon name="cart" /></div>
                </div>
                <div className="space-y-1">
                  {groceries.slice(0, 6).map((item) => (
                    <label key={item.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-2.5">
                      <input className="peer sr-only" type="checkbox" checked={item.checked} onChange={() => setGroceries((current) => current.map((entry) => entry.id === item.id ? { ...entry, checked: !entry.checked } : entry))} />
                      <span className="grid size-5 shrink-0 place-items-center rounded-md border-2 border-[#BBC4BB] text-transparent peer-checked:border-[#397050] peer-checked:bg-[#397050] peer-checked:text-white"><Icon name="check" className="size-3.5" /></span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm font-bold ${item.checked ? "text-[#929A94] line-through" : ""}`}>{item.name}</span>
                        <span className="block text-xs text-[#8A938C]">{item.detail}</span>
                      </span>
                      <span className="text-sm font-bold text-[#657068]">{item.owned ? <span className="rounded-full bg-[#EEF2E9] px-2 py-1 text-[10px] uppercase text-[#567153]">Owned</span> : formatWon(item.price)}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#EBEDE9] pt-4">
                  <span className="text-sm font-bold text-[#667169]">Estimated total</span>
                  <span className="text-lg font-extrabold">{formatWon(planned)}</span>
                </div>
              </section>
            </div>

            <section className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-[#E1E4DE] bg-white p-5">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[#F9EFE2] text-[#9C642D]"><Icon name="pantry" /></div>
                <p className="font-extrabold">12 pantry staples</p><p className="mt-1 text-sm text-[#78827B]">3 used in this week’s plan</p>
              </div>
              <div className="rounded-2xl border border-[#E1E4DE] bg-white p-5">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[#EAF0F7] text-[#4C6785]"><Icon name="receipt" /></div>
                <p className="font-extrabold">₩3,100 under plan</p><p className="mt-1 text-sm text-[#78827B]">Based on your last shop</p>
              </div>
              <div className="rounded-2xl border border-[#E1E4DE] bg-white p-5">
                <div className="mb-4 grid size-10 place-items-center rounded-xl bg-[#F0ECF7] text-[#6D568D]"><Icon name="calendar" /></div>
                <p className="font-extrabold">4 saved meals</p><p className="mt-1 text-sm text-[#78827B]">Ready to add next week</p>
              </div>
            </section>
          </div>

          {activeView === "calendar" && (() => {
            const days = [
              { label: "MON", date: 13 },
              { label: "TUE", date: 14 },
              { label: "WED", date: 15 },
              { label: "THU", date: 16 },
              { label: "FRI", date: 17 },
              { label: "SAT", date: 18 },
              { label: "SUN", date: 19 },
            ];
            const selectedLogs = foodLogs.filter((entry) => entry.day === selectedDay);
            const calories = selectedLogs.reduce((total, entry) => total + entry.calories, 0);
            const cost = selectedLogs.reduce((total, entry) => total + entry.cost, 0);
            const target = calorieTarget || 2000;
            return (
              <div>
                <div className="mb-6 flex items-end justify-between">
                  <div>
                    <p className="mb-1 text-sm font-bold text-[#718076]">FOOD CALENDAR</p>
                    <h1 className="text-2xl font-extrabold tracking-[-0.04em]">May 13–19</h1>
                    <p className="mt-1 text-sm text-[#69746D]">Track what you eat and spend.</p>
                  </div>
                  <Button className="!size-11 !rounded-full !p-0" onClick={() => setModal("foodLog")}><Icon name="plus" /></Button>
                </div>

                <section className="mb-4 rounded-3xl border border-[#E1E4DE] bg-white p-3">
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                      const dayLogs = foodLogs.filter((entry) => entry.day === day.date);
                      const hasLogs = dayLogs.length > 0;
                      return (
                        <button key={day.date} onClick={() => setSelectedDay(day.date)} className={`flex flex-col items-center rounded-2xl py-3 transition ${selectedDay === day.date ? "bg-[#245C43] text-white shadow-sm" : "text-[#657068] hover:bg-[#F2F5F0]"}`}>
                          <span className="text-[9px] font-extrabold tracking-wider">{day.label}</span>
                          <span className="mt-1 text-base font-extrabold">{day.date}</span>
                          <span className={`mt-1.5 size-1.5 rounded-full ${hasLogs ? selectedDay === day.date ? "bg-[#E7C774]" : "bg-[#4D7B60]" : "bg-transparent"}`} />
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="mb-4 overflow-hidden rounded-3xl bg-[#214F3B] p-5 text-white">
                  <div className="mb-5 flex items-center justify-between">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-[#BBD2C2]">May {selectedDay}</p><p className="mt-1 text-lg font-extrabold">Daily progress</p></div>
                    <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{selectedLogs.length} {selectedLogs.length === 1 ? "entry" : "entries"}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs font-bold text-[#BBD2C2]">CALORIES</p>
                      <p className="mt-2 text-2xl font-extrabold">{calories.toLocaleString()}</p>
                      <p className="mt-1 text-xs text-[#BBD2C2]">of {target.toLocaleString()} kcal</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#E7C774]" style={{ width: `${Math.min(100, (calories / target) * 100)}%` }} /></div>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs font-bold text-[#BBD2C2]">FOOD COST</p>
                      <p className="mt-2 text-2xl font-extrabold">{formatWon(cost)}</p>
                      <p className="mt-1 text-xs text-[#BBD2C2]">of {formatWon(dailyBudget)}</p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#8FC49E]" style={{ width: `${Math.min(100, (cost / dailyBudget) * 100)}%` }} /></div>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-[#E1E4DE] bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div><h2 className="text-lg font-extrabold">Food log</h2><p className="mt-1 text-sm text-[#7A847D]">Meals and snacks consumed</p></div>
                    <Button variant="secondary" className="!px-3" onClick={() => setModal("foodLog")}><Icon name="plus" className="size-4" /> Add</Button>
                  </div>
                  {selectedLogs.length ? (
                    <div className="space-y-2">
                      {selectedLogs.map((entry) => (
                        <article key={entry.id} className="flex items-center gap-3 rounded-2xl bg-[#F7F8F5] p-3">
                          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#356049] shadow-sm"><Icon name={entry.type === "Snack" ? "spark" : "leaf"} className="size-5" /></div>
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">{entry.name}</p><p className="mt-0.5 text-xs text-[#7F8982]">{entry.type} · {entry.time}</p></div>
                          <div className="text-right"><p className="text-sm font-extrabold">{entry.calories} kcal</p><p className="mt-0.5 text-xs font-bold text-[#77827A]">{formatWon(entry.cost)}</p></div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#CED5CD] px-5 py-10 text-center">
                      <div className="mx-auto grid size-11 place-items-center rounded-full bg-[#EEF3EC] text-[#50705B]"><Icon name="receipt" /></div>
                      <p className="mt-3 font-extrabold">Nothing logged yet</p>
                      <p className="mt-1 text-sm text-[#7A847D]">Add a meal or snack to track this day.</p>
                    </div>
                  )}
                </section>
              </div>
            );
          })()}
        </main>
      </div>

      <nav className="fixed bottom-0 left-1/2 z-40 grid w-full max-w-md -translate-x-1/2 grid-cols-5 border-t border-[#DEE3DC] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        {[["home", "Home"], ["calendar", "Calendar"], ["cart", "List"], ["pantry", "Pantry"], ["receipt", "Spend"]].map(([icon, label], index) => (
          <button key={label} onClick={() => index < 2 && setActiveView(index === 0 ? "overview" : "calendar")} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-bold ${(index === 0 && activeView === "overview") || (index === 1 && activeView === "calendar") ? "text-[#245C43]" : "text-[#7A847D]"}`}><Icon name={icon as IconName} className="size-5" />{label}</button>
        ))}
      </nav>

      {notice && <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#17251D] px-5 py-3 text-sm font-bold text-white shadow-xl"><Icon name="check" className="size-4" />{notice}</div>}

      {modal === "budget" && (
        <Modal title="Edit weekly budget" onClose={() => setModal(null)}>
          <form onSubmit={updateBudget} className="space-y-5">
            <Field label="Budget amount"><div className="flex items-center rounded-xl border border-[#CBD2CA] px-4 focus-within:border-[#386C4E] focus-within:ring-2 focus-within:ring-[#DDEBE0]"><span className="font-bold text-[#6E7871]">₩</span><input name="budget" type="number" defaultValue={budget} className="w-full bg-transparent px-3 py-3.5 font-bold outline-none" /></div></Field>
            <Field label="Budget period"><select className="w-full rounded-xl border border-[#CBD2CA] bg-white px-4 py-3.5 font-bold outline-none focus:border-[#386C4E]"><option>Weekly</option><option>Monthly</option></select></Field>
            <Button type="submit" className="w-full">Save budget</Button>
          </form>
        </Modal>
      )}

      {modal === "spending" && (
        <Modal title="Record actual spending" onClose={() => setModal(null)}>
          <form onSubmit={updateSpending} className="space-y-5">
            <div className="rounded-2xl bg-[#F3F5F1] p-4 text-sm text-[#657068]">Enter your total receipt amount. This replaces the current actual spend for this week.</div>
            <Field label="Total spent"><div className="flex items-center rounded-xl border border-[#CBD2CA] px-4 focus-within:border-[#386C4E]"><span className="font-bold text-[#6E7871]">₩</span><input name="spent" type="number" defaultValue={spent} className="w-full bg-transparent px-3 py-3.5 font-bold outline-none" /></div></Field>
            <Button type="submit" className="w-full">Update spending</Button>
          </form>
        </Modal>
      )}

      {modal === "meal" && (
        <Modal title="Add a meal" onClose={() => setModal(null)}>
          <form onSubmit={addMeal} className="space-y-4">
            <Field label="Meal name"><input required name="meal" placeholder="e.g. Tofu stir-fry" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none placeholder:text-[#A2AAA4] focus:border-[#386C4E]" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Day"><select name="day" className="w-full rounded-xl border border-[#CBD2CA] bg-white px-4 py-3.5 outline-none"><option>FRI</option><option>SAT</option><option>SUN</option><option>MON</option><option>TUE</option><option>WED</option><option>THU</option></select></Field>
              <Field label="Estimated cost"><input name="cost" type="number" placeholder="₩ 0" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none focus:border-[#386C4E]" /></Field>
            </div>
            <Field label="Ingredients"><textarea name="ingredients" rows={3} placeholder="Tofu, broccoli, rice (comma separated)" className="w-full resize-none rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none placeholder:text-[#A2AAA4] focus:border-[#386C4E]" /></Field>
            <p className="text-xs leading-relaxed text-[#7E8981]">New ingredients will be added to your grocery list. Duplicates are combined automatically.</p>
            <Button type="submit" className="w-full">Add meal to plan</Button>
          </form>
        </Modal>
      )}

      {modal === "foodLog" && (
        <Modal title={`Log food · May ${selectedDay}`} onClose={() => setModal(null)}>
          <form onSubmit={addFoodLog} className="space-y-4">
            <Field label="What did you have?"><input required name="name" placeholder="e.g. Tuna sandwich" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none placeholder:text-[#A2AAA4] focus:border-[#386C4E]" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type"><select name="type" className="w-full rounded-xl border border-[#CBD2CA] bg-white px-4 py-3.5 outline-none focus:border-[#386C4E]"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option><option>Drink</option></select></Field>
              <Field label="Time"><input required name="time" type="time" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none focus:border-[#386C4E]" /></Field>
              <Field label="Calories"><div className="flex items-center rounded-xl border border-[#CBD2CA] px-3 focus-within:border-[#386C4E]"><input required name="calories" type="number" min="0" placeholder="0" className="min-w-0 flex-1 bg-transparent py-3.5 outline-none" /><span className="text-xs font-bold text-[#89928B]">kcal</span></div></Field>
              <Field label="Cost incurred"><div className="flex items-center rounded-xl border border-[#CBD2CA] px-3 focus-within:border-[#386C4E]"><span className="mr-1 font-bold text-[#6E7871]">₩</span><input required name="cost" type="number" min="0" placeholder="0" className="min-w-0 flex-1 bg-transparent py-3.5 outline-none" /></div></Field>
            </div>
            <div className="rounded-2xl bg-[#F3F6F1] p-4 text-xs leading-relaxed text-[#667169]">This cost will be added to your weekly actual spending, and both calories and cost will appear on May {selectedDay}.</div>
            <Button type="submit" className="w-full">Add to food log</Button>
          </form>
        </Modal>
      )}

      {showSetup && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#E9ECE6]">
          <div className="mx-auto min-h-full max-w-md bg-white shadow-[0_0_60px_rgba(27,41,33,0.16)]">
            <div className="w-full overflow-hidden bg-white">
              <div className="relative overflow-hidden bg-[#214F3B] p-7 pb-9 text-white">
                <div className="relative z-10">
                  <div className="mb-8 flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-xl bg-white/15"><Icon name="leaf" className="size-5" /></div>
                    <span className="font-extrabold">MealBudget</span>
                  </div>
                  <p className="text-sm font-extrabold uppercase tracking-widest text-[#BBD2C2]">Personalize your plan</p>
                  <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-[-0.04em]">Meals that fit your body and your budget.</h1>
                  <p className="mt-5 max-w-md leading-relaxed text-[#C6D8CB]">We’ll estimate your daily energy needs, then shape an affordable meal guide around your target.</p>
                  <div className="mt-8 space-y-3">
                    {["A daily calorie estimate", "A practical meal-by-meal split", "A food allowance you choose"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm font-bold"><span className="grid size-6 place-items-center rounded-full bg-[#E7C774] text-[#214F3B]"><Icon name="check" className="size-3.5" /></span>{item}</div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-24 -right-20 size-64 rounded-full border-[3rem] border-white/5" />
              </div>
              <div className="p-6 pb-10">
                <div className="mb-7">
                  <p className="text-sm font-bold text-[#6E7A71]">STEP 1 OF 1</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em]">Tell us about your needs</h2>
                  <p className="mt-2 text-sm text-[#7C867F]">Your details are used only to calculate this estimate.</p>
                </div>
                <form onSubmit={calculateNeeds} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Age"><input required name="age" type="number" min="16" max="100" defaultValue="21" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none focus:border-[#386C4E] focus:ring-2 focus:ring-[#E1EDE3]" /></Field>
                    <Field label="Sex used for estimate"><select name="sex" className="w-full rounded-xl border border-[#CBD2CA] bg-white px-4 py-3.5 outline-none focus:border-[#386C4E]"><option value="female">Female</option><option value="male">Male</option></select></Field>
                    <Field label="Height (cm)"><input required name="height" type="number" min="120" max="230" defaultValue="165" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none focus:border-[#386C4E] focus:ring-2 focus:ring-[#E1EDE3]" /></Field>
                    <Field label="Weight (kg)"><input required name="weight" type="number" min="35" max="250" defaultValue="60" className="w-full rounded-xl border border-[#CBD2CA] px-4 py-3.5 outline-none focus:border-[#386C4E] focus:ring-2 focus:ring-[#E1EDE3]" /></Field>
                  </div>
                  <Field label="Typical activity level"><select name="activity" className="w-full rounded-xl border border-[#CBD2CA] bg-white px-4 py-3.5 outline-none focus:border-[#386C4E]"><option value="1.2">Mostly seated</option><option value="1.375">Lightly active · 1–3 days/week</option><option value="1.55">Moderately active · 3–5 days/week</option><option value="1.725">Very active · 6–7 days/week</option></select></Field>
                  <Field label="Your goal"><select name="goal" className="w-full rounded-xl border border-[#CBD2CA] bg-white px-4 py-3.5 outline-none focus:border-[#386C4E]"><option value="maintain">Maintain weight</option><option value="lose">Gradual weight loss</option><option value="gain">Gradual weight gain</option></select></Field>
                  <Field label="Daily food budget">
                    <div className="flex items-center rounded-xl border border-[#CBD2CA] px-4 focus-within:border-[#386C4E] focus-within:ring-2 focus-within:ring-[#E1EDE3]">
                      <span className="font-bold text-[#6E7871]">₩</span>
                      <input required name="dailyBudget" type="number" min="1" defaultValue={dailyBudget} className="w-full bg-transparent px-3 py-3.5 font-bold outline-none" />
                      <span className="whitespace-nowrap text-xs font-semibold text-[#8A938C]">per day</span>
                    </div>
                    <span className="mt-2 block text-xs text-[#8A938C]">We’ll multiply this by seven to create your weekly budget. You can change it later.</span>
                  </Field>
                  <Button type="submit" className="w-full !py-3.5">Calculate my meal guide <Icon name="chevron" className="size-4" /></Button>
                  {calorieTarget && <button type="button" onClick={() => setShowSetup(false)} className="w-full py-1 text-sm font-bold text-[#6D786F] hover:text-[#245C43]">Keep my current target</button>}
                  <p className="text-center text-[11px] leading-relaxed text-[#929A94]">This estimate uses a standard BMR equation and is intended for general meal planning only.</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
