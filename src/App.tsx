import React, { useState, useMemo, useEffect } from "react";
import type { ChangeEvent } from "react";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import aircraftFile from "./assets/aircraft_data.xlsx";

interface Aircraft {
  ICAO_Code?: string;
  FAA_Designator?: string;
  Manufacturer?: string;
  Model_FAA?: string;
  Wingspan_ft_without_winglets_sharklets?: number | string;
  Wingspan_ft_with_winglets_sharklets?: number | string;
  Length_ft?: number | string;
  Tail_Height_at_OEW_ft?: number | string;
  Wheelbase_ft?: number | string;
  Cockpit_to_Main_Gear_ft?: number | string;
  Main_Gear_Width_ft?: number | string;
  MTOW_lb?: number | string;
  MALW_lb?: number | string;
  Main_Gear_Config?: string;
  ICAO_WTC?: string;
  Parking_Area_ft2?: number | string;
  Class?: string;
  FAA_Weight?: number | string;
  CWT?: number | string;
  One_Half_Wake_Category?: string;
  Two_Wake_Category_Appx_A?: string;
  Two_Wake_Category_Appx_B?: string;
  Rotor_Diameter_ft?: number | string;
  SRS?: string;
  LAHSO?: string;
  Physical_Class_Engine?: string;
  Num_Engines?: number | string;
  AAC?: number | string;
  Approach_Speed_knot?: number | string;
  FAA_Registry?: string;
  Registration_Count?: number | string;
  TMFS_Operations_FY24?: number | string;
  Remarks?: string;
  [key: string]: any;
}

// Формула скорости взлета (площадь в ft² конвертируем в м²)
const computeSpeed = (wingArea_ft2: number, angle: number) => {
  if (!wingArea_ft2 || !angle) return null;
  const Cl = 0.1 * angle;
  const rho = 1.225;
  const W = 600000;
  const wingArea_m2 = wingArea_ft2 * 0.092903;
  const v = Math.sqrt((2 * W) / (rho * wingArea_m2 * Cl));
  return Math.round(v);
};

export default function App() {
  const [excelData, setExcelData] = useState<Aircraft[]>([]);
  const [name, setName] = useState("");
  const [wingArea, setWingArea] = useState<number | "">("");
  const [angle, setAngle] = useState<number>(10);
  const [suggestions, setSuggestions] = useState<Aircraft[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  useEffect(() => {
    const loadExcel = async () => {
      const response = await fetch(aircraftFile);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: Aircraft[] = XLSX.utils.sheet_to_json(sheet);
      setExcelData(json);
    };
    loadExcel();
  }, []);

  const filterSuggestions = (value: string) => {
    if (!value) return [];
    const query = value.trim().toLowerCase();
    return excelData
      .filter((item) => {
        const fields = [
          item.ICAO_Code,
          item.FAA_Designator,
          item.Manufacturer,
          item.Model_FAA,
        ];
        return fields.some(
          (f) => f && f.toString().toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const aExact = a.Model_FAA?.toLowerCase() === query ? 0 : 1;
        const bExact = b.Model_FAA?.toLowerCase() === query ? 0 : 1;
        return aExact - bExact;
      });
  };

  const debouncedName = useMemo(
    () =>
      debounce((v: string) => {
        setSuggestions(filterSuggestions(v));
      }, 300),
    [excelData]
  );

  const handleName = (v: string) => {
    setName(v);
    debouncedName(v);
  };

  const handleSelect = (model: Aircraft) => {
    setName(model.Model_FAA || "");
    setSelectedAircraft(model);

    // Выбираем сначала Wingspan_ft_without_winglets_sharklets, иначе Wingspan_ft_with_winglets_sharklets
    let wingArea_ft2: number | "" = "";
    if (model.Wingspan_ft_without_winglets_sharklets) {
      const val = parseFloat(model.Wingspan_ft_without_winglets_sharklets.toString());
      if (!isNaN(val) && val > 0) wingArea_ft2 = val;
    } else if (model.Wingspan_ft_with_winglets_sharklets) {
      const val = parseFloat(model.Wingspan_ft_with_winglets_sharklets.toString());
      if (!isNaN(val) && val > 0) wingArea_ft2 = val;
    }

    setWingArea(wingArea_ft2);
    setSuggestions([]);
  };

  const handleWingAreaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") setWingArea("");
    else {
      const num = parseFloat(val);
      setWingArea(isNaN(num) || num < 0 ? "" : num);
    }
  };

  const handleAngleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    setAngle(isNaN(num) ? 0 : num);
  };

  // Для скорости берем либо введенное пользователем значение, либо значение из таблицы
  const effectiveWingArea =
    wingArea !== "" ? wingArea : selectedAircraft?.Wingspan_ft_without_winglets_sharklets
      ? parseFloat(selectedAircraft.Wingspan_ft_without_winglets_sharklets.toString())
      : selectedAircraft?.Wingspan_ft_with_winglets_sharklets
        ? parseFloat(selectedAircraft.Wingspan_ft_with_winglets_sharklets.toString())
        : null;

  const speedNormal =
    effectiveWingArea !== null ? computeSpeed(effectiveWingArea, angle) : null;

  const speedExtended =
    selectedAircraft?.Wingspan_ft_with_winglets_sharklets &&
    effectiveWingArea !== null &&
    parseFloat(selectedAircraft.Wingspan_ft_with_winglets_sharklets.toString()) > effectiveWingArea
      ? computeSpeed(parseFloat(selectedAircraft.Wingspan_ft_with_winglets_sharklets.toString()), angle)
      : null;

  const fieldsToShow = [
    "Wingspan_ft_without_winglets_sharklets",
    "Wingspan_ft_with_winglets_sharklets",
    "Length_ft",
    "Tail_Height_at_OEW_ft",
    "Wheelbase_ft",
    "Cockpit_to_Main_Gear_ft",
    "Main_Gear_Width_ft",
    "MTOW_lb",
    "MALW_lb",
    "Main_Gear_Config",
    "ICAO_WTC",
    "Parking_Area_ft2",
    "Class",
    "FAA_Weight",
    "CWT",
    "One_Half_Wake_Category",
    "Two_Wake_Category_Appx_A",
    "Two_Wake_Category_Appx_B",
    "Rotor_Diameter_ft",
    "SRS",
    "LAHSO",
    "FAA_Registry",
    "Registration_Count",
    "TMFS_Operations_FY24",
    "Remarks",
  ];

  const darkBg = "#1e1e1e";
  const cardBg = "#2c2c2c";
  const inputBg = "#3a3a3a";
  const textColor = "#f5f5f5";
  const accentColor = "#4fc3f7";
  const highlightBg = "#444";


  return (
    <div style={{
      padding: "20px",
      maxWidth: "900px",
      margin: "auto",
      fontFamily: "Segoe UI, sans-serif",
      background: darkBg,
      minHeight: "100vh",
      color: textColor
    }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: accentColor }}>
        Aircraft Takeoff Speed Calculator
      </h1>

      {/* Input Card */}
      <div style={{
        background: cardBg,
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        marginBottom: "20px"
      }}>
        <div style={{ marginBottom: "16px", position: "relative" }}>
          <label style={{ fontWeight: 600 }}>Aircraft Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleName(e.target.value)}
            placeholder="Start typing..."
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #555",
              outline: "none",
              background: inputBg,
              color: textColor,
              transition: "0.2s",
            }}
          />
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute",
              background: cardBg,
              border: "1px solid #555",
              borderRadius: "8px",
              width: "100%",
              maxHeight: "180px",
              overflowY: "auto",
              zIndex: 10,
              marginTop: "2px",
            }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSelect(s)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: i !== suggestions.length - 1 ? "1px solid #555" : "none",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = highlightBg}
                  onMouseLeave={(e) => e.currentTarget.style.background = cardBg}
                >
                  {s.Model_FAA}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontWeight: 600 }}>Wing Area (ft²):</label>
          <input
            type="number"
            value={wingArea === "" ? (effectiveWingArea || "") : wingArea}
            onChange={handleWingAreaChange}
            placeholder="Enter wing area..."
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #555",
              outline: "none",
              background: inputBg,
              color: textColor
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 600 }}>Angle of Attack (°):</label>
          <input
            type="number"
            value={angle}
            onChange={handleAngleChange}
            placeholder="Enter angle of attack..."
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #555",
              outline: "none",
              background: inputBg,
              color: textColor
            }}
          />
        </div>
      </div>

      {/* Speed Card */}
      <div style={{
        background: "#37474f",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        marginBottom: "20px",
      }}>
        <h3 style={{ marginBottom: "12px", color: accentColor }}>Takeoff Speed</h3>
        <p style={{ fontSize: "18px" }}>
          Normal Wings: <strong>{speedNormal !== null ? `${speedNormal} km/h` : "—"}</strong>
        </p>
        {speedExtended !== null && (
          <p style={{ fontSize: "18px" }}>
            Extended Wings: <strong>{speedExtended} km/h</strong>
          </p>
        )}
      </div>

      {/* Aircraft Info Card */}
      {selectedAircraft && (
        <div style={{
          background: "#263238",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}>
          <h3 style={{ marginBottom: "16px", color: accentColor }}>Selected Aircraft Info</h3>
          {fieldsToShow.map((field) => selectedAircraft[field] !== undefined && (
            <p key={field}><strong>{field.replace(/_/g, " ")}:</strong> {selectedAircraft[field]}</p>
          ))}
          <p><strong>Engines:</strong> {selectedAircraft.Num_Engines || "—"} ({selectedAircraft.Physical_Class_Engine || "—"})</p>
          <p><strong>AAC:</strong> {selectedAircraft.AAC || "—"}</p>
          <p><strong>Approach Speed (knot):</strong> {selectedAircraft.Approach_Speed_knot || "—"}</p>
        </div>
      )}
    </div>
  );
}
