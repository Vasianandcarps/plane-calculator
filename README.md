
```md
# ✈️ Aircraft Takeoff Speed Calculator

A web application built with **React + TypeScript** that loads aircraft data from an **Excel file**, allows smart aircraft search, and **calculates takeoff speed** based on wing area and angle of attack.

This project is intended for **educational, engineering, and demonstration purposes** in aerodynamics.

## 🚀 Features

- 🔍 Aircraft search by:
  - ICAO Code
  - FAA Designator
  - Manufacturer
  - Aircraft Model
- 📊 Excel (`.xlsx`) data loading
- ⚡ Fast search with debounce
- ✏️ Manual wing area input
- 📐 Adjustable angle of attack
- 🧮 Automatic takeoff speed calculation
- 🪶 Support for normal and extended wingspan
- 🌙 Dark UI theme
- 📋 Detailed aircraft information panel


## 🧠 Calculation Formula

Takeoff speed is calculated using the formula:

```

V = √( (2 × W) / (ρ × S × Cl) )

```

Where:
- `W` — aircraft weight (fixed value: **600,000 N**)
- `ρ` — air density (**1.225 kg/m³**)
- `S` — wing area (**converted from ft² to m²**)
- `Cl = 0.1 × angle of attack`

The result is displayed in **km/h**.

⚠️ This is a **simplified aerodynamic model** and should not be used for real-world flight operations.


## 🧩 Tech Stack

- ⚛️ React
- 📘 TypeScript
- 📄 XLSX (Excel parsing)
- ⏱ Lodash Debounce
- 🎨 Inline Styles with Dark Theme


## 📁 Project Structure

```

src/
├── assets/
│   └── aircraft_data.xlsx
├── App.tsx
└── main.tsx

```

## 🛠 Installation & Run

### 1️⃣ Install dependencies
```

npm install

```

### 2️⃣ Run development server
```

npm run dev

```

## 📥 Data Source

Aircraft data is loaded from (https://www.faa.gov/airports/engineering/aircraft_char_database):

```

/src/assets/aircraft_data.xlsx

```

The Excel file should include fields such as:
- `Model_FAA`
- `ICAO_Code`
- `Wingspan_ft_without_winglets_sharklets`
- `MTOW_lb`
- `Num_Engines`
- and other aircraft parameters.


## ✅ How It Works

1. The Excel file is loaded on app startup
2. The user types an aircraft name
3. Smart suggestions appear
4. After selecting a model:
   - Wing area is auto-filled
   - Aircraft technical data is displayed
5. The user sets the angle of attack
6. The app calculates:
   - Takeoff speed with normal wings
   - Takeoff speed with extended wings (if available)

## 📌 Limitations
- ❗ Not a certified flight calculation tool
- ⚖️ Aircraft weight is fixed
- 🧮 Lift coefficient is highly simplified

## 🧑‍💻 Author

Created for educational and research purposes.  
Free to use, modify, and extend.

## 📜 License

MIT License — free to use in personal and commercial projects.

Если нужно — могу сделать версию под **open-source стандарт**, добавить **Live Demo**, **Screenshots**, или **API description**.

