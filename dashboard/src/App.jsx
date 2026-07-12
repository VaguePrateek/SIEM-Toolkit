import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <BrowserRouter>

            <div className="flex bg-slate-950 text-white">

                <Sidebar />

                <div className="flex-1">

                    <Navbar />

                    <main className="p-8">

                        <Routes>

                            <Route
                                path="/"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/alerts"
                                element={<h1>Alerts Page</h1>}
                            />

                            <Route
                                path="/events"
                                element={<h1>Events Page</h1>}
                            />

                            <Route
                                path="/analytics"
                                element={<h1>Analytics Page</h1>}
                            />

                            <Route
                                path="/settings"
                                element={<h1>Settings Page</h1>}
                            />

                        </Routes>

                    </main>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;