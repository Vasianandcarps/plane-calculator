

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

---

## 📸 Screenshots
<img width="500"  alt="image" src="https://github.com/user-attachments/assets/afaad0d4-c13e-42eb-a683-59e7240f1203" />

### 🔍 Aircraft Search
<img width="500" alt="image" src="https://github.com/user-attachments/assets/355d56a5-dda2-4571-b5de-91e94099aa3d" />


### 📐 Input Parameters
<img width="500" alt="image" src="https://github.com/user-attachments/assets/1e1866bd-6312-4bc8-bcc1-a9a9ea07fe17" />


### 🧮 Takeoff Speed Calculation
<img width="500" alt="image" src="https://github.com/user-attachments/assets/42503411-73f0-4c65-8fc9-c6dbd175ea9c" />


### 📋 Aircraft Technical Details
<img width="500" alt="image" src="https://github.com/user-attachments/assets/8c619ed8-db56-43f5-ae52-f8b41113af18" />


## 📜 License

MIT License — free to use in personal and commercial projects.

