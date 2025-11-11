export default function TestCategoryPage() {
  console.log('✅ TEST PAGE LOADED!');
  
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '48px', marginBottom: '20px' }}>
        🔥 TEST CATEGORY PAGE 🔥
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '10px' }}>
        Nếu bạn thấy trang này, nghĩa là routing hoạt động!
      </p>
      <p style={{ fontSize: '18px', color: 'green' }}>
        Mở Console (F12) để xem log "✅ TEST PAGE LOADED!"
      </p>
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2>Thông tin:</h2>
        <ul>
          <li>URL: {window.location.href}</li>
          <li>Pathname: {window.location.pathname}</li>
          <li>Time: {new Date().toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
}
