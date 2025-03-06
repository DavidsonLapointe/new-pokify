
import { useState, useEffect } from "react";
import { FinancialTitle, TitleStatus } from "@/types/financial";
import { isBefore } from "date-fns";

export const checkTitleStatus = (title: FinancialTitle): TitleStatus => {
  if (title.status === "paid") return "paid";
  
  const today = new Date();
  const dueDate = new Date(title.dueDate);
  
  if (isBefore(dueDate, today)) {
    return "overdue";
  }
  
  return "pending";
};

export const useTitleStatus = (initialTitles: FinancialTitle[]) => {
  const [titles, setTitles] = useState<FinancialTitle[]>(initialTitles);

  useEffect(() => {
    setTitles(initialTitles);
  }, [initialTitles]);

  useEffect(() => {
    const updateTitlesStatus = () => {
      setTitles(prevTitles => 
        prevTitles.map(title => ({
          ...title,
          status: checkTitleStatus(title)
        }))
      );
    };

    updateTitlesStatus();
    const interval = setInterval(updateTitlesStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return { titles, setTitles };
};
