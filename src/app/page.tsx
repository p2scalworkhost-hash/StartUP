import Link from 'next/link';
import { Button } from '@/components/ui/Button';

// Icons
const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">SHEQ Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              เข้าสู่ระบบ
            </Link>
            <Link href="/register">
              <Button size="sm" className="hidden sm:inline-flex">
                เริ่มต้นใช้งานฟรี
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: AI Gap Analysis Engine v2.0
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
            มาตรฐานกฎหมาย SHEQ <br className="hidden sm:block" />
            <span className="text-white">วิเคราะห์ด้วย AI อัจฉริยะ</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            แพลตฟอร์มเดียวที่ช่วยให้ธุรกิจของคุณสอดคล้องกับกฎหมายความปลอดภัย สิ่งแวดล้อม และคุณภาพ
            ลดความเสี่ยง ลดค่าปรับ และสร้างความมั่นใจให้คู่ค้า
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 text-base shadow-xl shadow-blue-500/20">
                เริ่มประเมินฟรี
                <svg className="w-5 h-5 ml-2 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 text-base !bg-transparent border-slate-700 hover:bg-slate-800 text-slate-300">
                <PlayIcon />
                ดูวิดีโอแนะนำ
              </Button>
            </Link>
          </div>

          {/* CSS Dashboard Mockup */}
          <div className="relative max-w-5xl mx-auto perspective-1000">
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden transform rotate-x-6 hover:rotate-x-0 transition-transform duration-700 ease-out-expo group">
              {/* Header */}
              <div className="h-10 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
                <div className="mx-auto w-1/3 h-5 bg-slate-900 rounded-md border border-slate-700/50 text-xs flex items-center justify-center text-slate-500 font-mono">
                  sheq-platform.com/dashboard
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid grid-cols-12 gap-6 bg-slate-900/50">
                {/* Sidebar Mock */}
                <div className="col-span-2 space-y-3 hidden sm:block">
                  <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse delay-75" />
                  <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse delay-100" />
                  <div className="h-4 w-5/6 bg-slate-800/50 rounded animate-pulse delay-150" />
                </div>

                {/* Main Content */}
                <div className="col-span-12 sm:col-span-10 grid grid-cols-3 gap-4">
                  {/* Score Card */}
                  <div className="col-span-3 lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                    <div>
                      <h3 className="text-blue-100 font-medium">Compliance Score</h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">85%</span>
                        <span className="text-sm text-green-400 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          +12%
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 w-full bg-blue-950/50 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 w-[85%]" />
                    </div>
                  </div>

                  {/* Stat Card */}
                  <div className="col-span-3 lg:col-span-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-2 right-2 p-1.5 bg-red-500/10 rounded-lg">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="text-slate-400 text-sm font-medium">Critical Issues</h3>
                    <p className="text-2xl font-bold text-white mt-2">3 <span className="text-sm font-normal text-slate-500">items</span></p>
                    <div className="mt-4 space-y-2">
                      <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[70%]" />
                      </div>
                    </div>
                  </div>

                  {/* List Items */}
                  <div className="col-span-3 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-amber-500'}`} />
                        <div className="h-2 w-1/3 bg-slate-600 rounded" />
                        <div className="h-2 w-1/4 bg-slate-700 rounded ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glow under dashboard */}
            <div className="absolute -bottom-10 left-10 right-10 h-20 bg-blue-500/20 blur-[60px] -z-10" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">ฟีเจอร์ที่ออกแบบมาเพื่อคุณ</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              ครบถ้วนทุกฟังก์ชันที่คุณต้องการ สำหรับการบริหารจัดการความปลอดภัยและสิ่งแวดล้อม
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Legal Mapping</h3>
              <p className="text-slate-400 leading-relaxed">
                ระบบคัดกรองกฎหมายอัตโนมัติจากฐานข้อมูลกว่า 1,000 ฉบับ ให้เหลือเฉพาะที่เกี่ยวข้องกับธุรกิจคุณ
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Gap Analysis</h3>
              <p className="text-slate-400 leading-relaxed">
                ประเมินช่องว่างความสอดคล้องพร้อมระดับความเสี่ยง (Risk Score) เพื่อจัดลำดับความสำคัญในการแก้ไข
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <DocumentTextIcon />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Auto Reports</h3>
              <p className="text-slate-400 leading-relaxed">
                สร้างรายงาน PDF สรุปผลสำหรับผู้บริหาร และ Excel สำหรับเจ้าหน้าที่ จป. เพื่อนำไปปฏิบัติงานต่อ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1,000+</div>
              <div className="text-slate-500 text-sm uppercase tracking-wider">Legal Databases</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-slate-500 text-sm uppercase tracking-wider">Happy Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-slate-500 text-sm uppercase tracking-wider">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-500 text-sm uppercase tracking-wider">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 opacity-20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">พร้อมยกระดับมาตรฐานความปลอดภัยหรือยัง?</h2>
          <p className="text-xl text-blue-100 mb-10">
            เริ่มต้นใช้งานได้ฟรีวันนี้ ไม่ต้องใช้บัตรเครดิต ยกเลิกได้ตลอดเวลา
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-10 py-4 text-lg bg-white text-blue-600 hover:bg-blue-50 shadow-xl shadow-blue-900/20 border-0">
                สมัครสมาชิกฟรี
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-blue-200 text-blue-100 hover:bg-blue-800/30">
                ติดต่อฝ่ายขาย
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200 opacity-60">
            ทดลองใช้ฟรี 14 วันสำหรับแพ็กเกจ Pro
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-slate-300 font-semibold">SHEQ Platform</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link href="#" className="hover:text-white transition-colors">เงื่อนไขการใช้งาน</Link>
            <Link href="#" className="hover:text-white transition-colors">ช่วยเหลือ</Link>
          </div>
          <div className="text-xs text-slate-600">
            © 2026 SHEQ Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
