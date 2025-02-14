
import { useState } from "react";
import { Call } from "@/types/calls";
import { mockCalls } from "@/mocks/calls";

export const useCallsPage = () => {
  const getCurrentMonthYear = () => {
    const date = new Date();
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [monthStats, setMonthStats] = useState({
    total: 0,
    processed: 0,
    pending: 0,
    failed: 0,
  });
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const getMonthYearOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthYear = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      options.push(monthYear);
    }
    
    return options;
  };

  const handleMonthYearChange = (value: string) => {
    setSelectedMonthYear(value);
    const [month, year] = value.split('/');
    const total = Math.floor(Math.random() * 100) + 50;
    const processed = Math.floor(total * 0.7);
    const pending = Math.floor(total * 0.2);
    const failed = total - processed - pending;
    
    setMonthStats({
      total,
      processed,
      pending,
      failed,
    });
  };

  const handlePlayAudio = (audioUrl: string) => {
    console.log(`Reproduzindo áudio: ${audioUrl}`);
  };

  const handleViewAnalysis = (call: Call) => {
    setSelectedCall(call);
    setIsAnalysisOpen(true);
  };

  const handleCloseAnalysis = () => {
    setIsAnalysisOpen(false);
    setSelectedCall(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredCalls = mockCalls.filter((call) => {
    const matchesStatus = selectedStatus === "all" || call.status === selectedStatus;
    const matchesSearch =
      call.phone.includes(searchQuery) ||
      call.seller.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return {
    selectedMonthYear,
    selectedStatus,
    searchQuery,
    monthStats,
    selectedCall,
    isAnalysisOpen,
    filteredCalls,
    getMonthYearOptions,
    handleMonthYearChange,
    setSelectedStatus,
    setSearchQuery,
    handlePlayAudio,
    handleViewAnalysis,
    handleCloseAnalysis,
    formatDate,
  };
};
