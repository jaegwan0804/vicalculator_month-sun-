/* -------- 상수 -------- */
const H = 3;          // 태양광 H_vir (고정)
const A = 0.9;        // 가용률 (고정)
const unitPrice = 18_000;  // VIC 단가

let pvType = null;    // 'ground' or 'building'

/* -------- 1단계: 타입 선택 -------- */
document.querySelectorAll(".big-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    pvType = btn.dataset.type;              // 선택 저장
    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
  });
});

/* -------- 2단계: 계산 -------- */
document.getElementById("calcBtn").addEventListener("click",()=>{
  const P = parseFloat(document.getElementById("capacity").value || 0); // MW
  const E = parseFloat(document.getElementById("energy").value   || 0); // MWh

  if(!P || !E){ alert("용량과 발전량을 모두 입력하세요"); return; }

  /* 가중치 W 판단 */
  let W;
  if(pvType==="building"){ W = 1.6; }
  else{ // ground
    if(P<=0.1)      W = 1.5;
    else if(P<=30)  W = 1.4;
    else            W = 1.3;
  }

  /* CF 계산 */
  const CF = E / (P * 720);  // P*720 = 월 이론 최대 (MWh)

  /* k_hour 평균 = 1 로 가정 */
  const VIC = H * P * A * CF * W * 1;   // 정산기간 총 VIC (단위: VIC)

  /* 의무 VIC = CF * E_actual (요구 사항 그대로) */
  const vicObl = CF * E;

  /* 수익 */
  const revenue = (VIC - vicObl) * unitPrice;

  /* 결과 표시 */
  document.getElementById("result").innerHTML =
    `설비 유형&nbsp;: <b>${pvType==="building"?"건축물":"일반부지"}</b><br>`+
    `가중치 W&nbsp;&nbsp;: <b>${W}</b><br><br>`+
    `정산기간 VIC 발급량&nbsp;: <b>${VIC.toFixed(3)}</b> VIC<br>`+
    `정산기간 VIC 의무량&nbsp;: <b>${vicObl.toFixed(3)}</b> VIC<br>`+
    `정산기간 총 수익&nbsp;&nbsp;&nbsp;: <b>${revenue.toLocaleString()} 원</b>`;

  document.getElementById("result").classList.remove("hidden");
});
