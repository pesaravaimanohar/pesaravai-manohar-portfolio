import { useRef, useState } from 'react';

const SOURCE_URL = 'https://github.com/pesaravaimanohar/Smart_Campus_Attendance_Management/blob/HEAD/backend/src/main/java/com/college/smartattendance/service/AttendanceService.java';

// Plan scale: 2 SVG units per metre, faculty at the centre.
const WIDTH = 400;
const HEIGHT = 240;
const CENTER = { x: 200, y: 120 };
const SCALE = 2;
const RADIUS = 50;
const ORIGIN = { lat: 14.6546, lon: 77.6062 };

const STEPS = [
  'QR token matches a session',
  'Session is active and not past its end time',
  'Student is enrolled in this class',
  'Student hasn’t already been marked',
  'Haversine distance is within the radius',
];

const toRadians = degrees => degrees * Math.PI / 180;

// Same Haversine formula as calculateDistance in AttendanceService.java
function haversine(a, b) {
  const dLat = toRadians(b.lat - a.lat);
  const dLon = toRadians(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 1000;
}

const toLatLon = ({ x, y }) => ({
  lat: ORIGIN.lat - y / 110574,
  lon: ORIGIN.lon + x / (111320 * Math.cos(toRadians(ORIGIN.lat))),
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function stepState(index, oldQr, outside) {
  if (oldQr) return index === 0 ? 'fail' : 'skip-step';
  return index === 4 && outside ? 'fail' : '';
}

function verdict(oldQr, outside, distance) {
  if (oldQr) return { status: 'ERROR, NO RECORD SAVED', remark: 'Invalid QR code. Please scan again.' };
  if (outside) return { status: 'REJECTED', remark: `Location Mismatch: ${distance.toFixed(2)}m away (max: ${RADIUS.toFixed(1)}m)` };
  return { status: 'PRESENT', remark: 'QR Verified' };
}

export default function GeofenceDemo() {
  const plan = useRef(null);
  const [position, setPosition] = useState({ x: 28, y: -15 });
  const [oldQr, setOldQr] = useState(false);

  const distance = haversine(ORIGIN, toLatLon(position));
  const outside = distance > RADIUS;
  const result = verdict(oldQr, outside, distance);
  const studentX = CENTER.x + position.x * SCALE;
  const studentY = CENTER.y + position.y * SCALE;

  const moveFromSlider = event => {
    const wanted = Number(event.target.value);
    const current = Math.hypot(position.x, position.y);
    const unitX = current > 1 ? position.x / current : 1;
    const unitY = current > 1 ? position.y / current : 0;
    // Keep the dot on the plan: at long range, lean towards the wider horizontal axis.
    const y = clamp(unitY * wanted, -54, 54);
    const x = Math.sqrt(Math.max(0, wanted * wanted - y * y)) * (unitX < 0 ? -1 : 1);
    setPosition({ x, y });
  };

  const moveFromPointer = event => {
    const box = plan.current.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width * WIDTH;
    const y = (event.clientY - box.top) / box.height * HEIGHT;
    setPosition({
      x: (clamp(x, 10, WIDTH - 10) - CENTER.x) / SCALE,
      y: (clamp(y, 10, HEIGHT - 10) - CENTER.y) / SCALE,
    });
  };

  const onPointerDown = event => {
    plan.current.setPointerCapture(event.pointerId);
    moveFromPointer(event);
  };

  const onPointerMove = event => {
    if (plan.current.hasPointerCapture(event.pointerId)) moveFromPointer(event);
  };

  return (
    <div className={`demo ${oldQr || outside ? 'bad' : ''}`}>
      <div className="demo-head">
        <h3>Try the attendance check</h3>
        <p>Drag the student, or use the slider. The order and messages below come from the real backend method.</p>
      </div>
      <svg id="plan" ref={plan} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby="plan-title" onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
        <title id="plan-title">Map of a 50 metre geofence around the faculty member, with the student’s position</title>
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => <line key={x} className="grid" x1={x} y1="0" x2={x} y2={HEIGHT} />)}
        {[40, 80, 120, 160, 200].map(y => <line key={y} className="grid" x1="0" y1={y} x2={WIDTH} y2={y} />)}
        <circle className="fence" cx={CENTER.x} cy={CENTER.y} r={RADIUS * SCALE} />
        <text x={CENTER.x} y="14" textAnchor="middle">50 m geofence</text>
        <line className="tie" x1={CENTER.x} y1={CENTER.y} x2={studentX} y2={studentY} />
        <circle className="faculty" cx={CENTER.x} cy={CENTER.y} r="6" />
        <text x={CENTER.x} y={CENTER.y + 20} textAnchor="middle">Faculty</text>
        <circle id="student" cx={studentX} cy={studentY} r="11" />
        <text x={clamp(studentX, 35, 365)} y={studentY < 36 ? studentY + 28 : studentY - 17} textAnchor="middle">Student</text>
      </svg>
      <div className="demo-ctl" aria-live="polite">
        <div className="dist">
          <label htmlFor="distance">Student’s distance from faculty</label>
          <output htmlFor="distance">{distance.toFixed(2)} m</output>
          <input id="distance" type="range" min="0" max="95" step="1" value={Math.round(distance)} onChange={moveFromSlider} />
        </div>
        <button className="ghost" type="button" aria-pressed={oldQr} onClick={() => setOldQr(!oldQr)}>
          {oldQr ? 'Scan the current QR code' : 'Scan an old QR code'}
        </button>
        <ol className="checks">
          {STEPS.map((step, index) => <li key={step} className={stepState(index, oldQr, outside)}>{step}</li>)}
        </ol>
        <div className="verdict"><b>{result.status}</b><span>{result.remark}</span></div>
        <p className="tiny">A browser copy of <a href={SOURCE_URL}><code>validateAndMarkByQr</code></a>. The enrolment and duplicate checks are assumed to pass here.</p>
      </div>
    </div>
  );
}
