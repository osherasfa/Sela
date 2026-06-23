import "./CSS/kanban.css";
import { useParams } from "react-router";
import { useState, useEffect } from "react";
import threeDots from "../assets/three-dots.svg";

// SVG Icon Components for tabs and settings
const BoardIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
        <line x1="15" y1="3" x2="15" y2="21"/>
    </svg>
);

const ListIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
);

const GanttIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
        <line x1="4" y1="6" x2="14" y2="6"/>
        <line x1="9" y1="12" x2="20" y2="12"/>
        <line x1="6" y1="18" x2="16" y2="18"/>
    </svg>
);

const CalendarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);

const TableIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tab-icon">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
        <line x1="10" y1="3" x2="10" y2="21"/>
    </svg>
);

const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
);

const FiltersIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
        <line x1="4" y1="21" x2="4" y2="14"/>
        <line x1="4" y1="10" x2="4" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12" y2="3"/>
        <line x1="20" y1="21" x2="20" y2="16"/>
        <line x1="20" y1="12" x2="20" y2="3"/>
        <line x1="1" y1="14" x2="7" y2="14"/>
        <line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="17" y1="16" x2="23" y2="16"/>
    </svg>
);

const GroupIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
        <line x1="3" y1="6" x2="15" y2="6"/>
        <line x1="3" y1="12" x2="18" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
);

const Kanban = () => {
    const { boardId } = useParams();
    const [ response, setResponse ] = useState({ data: null, loading: true, error: null });
    const [ activeTab, setActiveTab ] = useState("Board");
    
    useEffect(() => {
        const controller = new AbortController();
        async function fetchData() {
            try {
                const res = await fetch(`http://localhost:5000/api/boards/${boardId}`, { signal: controller.signal });
                if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                const data = await res.json();

                setResponse(prev => ({ ...prev, data, loading: false }));
            } catch (error) {
                if(error.name !== "AbortError")
                    setResponse(prev => ({ ...prev, error, loading: false }));
            }
        }

        if(boardId) fetchData();
        return () => controller.abort();
    }, [boardId]);

    const { data, loading, error } = response;
    console.log(data)
    
    const tabs = [
        { name: "Board", icon: BoardIcon },
        { name: "List", icon: ListIcon },
        { name: "Gantt", icon: GanttIcon },
        { name: "Calendar", icon: CalendarIcon },
        { name: "Table", icon: TableIcon }
    ];

    return (
        <div className="kanban-wrapper">
            <div className="kanban-header">
                <div className="board-name">
                    <h1>{loading ? "Loading..." : (data?.title || "Workspace")}</h1>
                    <button className="three-dots-btn">
                        <img src={threeDots} alt="menu" />
                    </button>
                </div>
                <div className="board-toolbar">
                    <div className="board-views">
                        {tabs.map(tab => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.name}
                                    className={`view-tab ${activeTab === tab.name ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.name)}
                                >
                                    <IconComponent />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                    <div className="board-settings">
                        <button className="action-btn">
                            <ShareIcon />
                            Share
                        </button>
                        <button className="action-btn">
                            <FiltersIcon />
                            Filters
                        </button>
                        <button className="action-btn">
                            <GroupIcon />
                            Group by: Status
                        </button>
                        <button className="add-task-btn">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
            { loading && (
                <div className="kanban-loading">
                    <div className="spinner"></div>
                    <p>Loading board data...</p>
                </div>
            ) }
            
            { error && (
                <div className="kanban-error">
                    <div className="error-icon">⚠️</div>
                    <h3>Failed to Load Board</h3>
                    <p>{error?.message || "An unexpected error occurred"}</p>
                </div>
            ) }
            
            { data && (
                <div className="kanban-board">
                    {JSON.stringify(data, null, 2)}
                </div>
            )}
        </div>
    );
};

export default Kanban; 