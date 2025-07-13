/* ===== 상수 ===== */
const H          = 3;          // H_vir
const A          = 0.9;        // 가용률
const kFactor    = 1.066;      // 시간 가중치 Σk_hour
const unitPrice  = 18_000;     // 단가 (원/VIC)

let pvType = null;             // 'ground' | 'building'

/* ===== 1단계: 설비 유형 선택 ===== */
document.querySelectorAll(".big-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    pvType = btn.dataset.type;
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
  });
});

/* ===== 2단계: 계산 ===== */
document.getElementById("calcBtn").addEventListener("click",()=>{
  const P = parseFloat(document.getElementById("capacity").value || 0);  // MW
  const E = parseFloat(document.getElementById("energy").value   || 0);  // MWh
  if(!P || !E){ alert("용량과 발전량을 모두 입력하세요"); return; }

  /* --- 가중치 W 결정 --- */
  let W;
  if(pvType === "building")         W = 1.6;
  else if(P <= 0.1)                 W = 1.5;
  else if(P <= 30)                  W = 1.4;
  else                               W = 1.3;

  /* --- CF & VIC 발급량 --- */
  const CF       = E / (P * 720);                // 월 이용률
  const vicMonth = H * P * A * CF * W * kFactor * 720; // 발급량

  /* --- 의무 VIC (= CF × E_actual) --- */
  const vicObl   = CF * E;

  /* --- 총 수익 --- */
  const revenue  = (vicMonth - vicObl) * unitPrice;

  /* --- 결과 표시 --- */
  document.getElementById("result").innerHTML =
    `설비 유형&nbsp;: <b>${pvType==="building"? "건축물":"일반부지"}</b><br>`+
    `가중치 W&nbsp;&nbsp;: <b>${W}</b><br><br>`+
    `월간 VIC 발급량&nbsp;: <b>${vicMonth.toFixed(3)}</b> VIC<br>`+
    `월간 VIC 의무량&nbsp;: <b>${vicObl.toFixed(3)}</b> VIC<br>`+
    `월간 총 수익&nbsp;&nbsp;&nbsp;: <b>${revenue.toLocaleString()} 원</b>`;

  document.getElementById("result").classList.remove("hidden");
});

