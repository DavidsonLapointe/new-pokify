
import { useState, useEffect } from "react";
import { FinancialTitle, TitleStatus } from "@/types/financial";
import { isBefore, isSameDay } from "date-fns";

export const checkTitleStatus = (title: FinancialTitle): TitleStatus => {
  if (title.status === "paid") return "paid";
  
  const today = new Date();
  const dueDate = new Date(title.dueDate);
  
  // Verifica se a data de vencimento é anterior a hoje (e não são o mesmo dia)
  // Um título só é considerado vencido se sua data de vencimento for ANTERIOR à data atual
  if (isBefore(dueDate, today) && !isSameDay(dueDate, today)) {
    return "overdue";
  }
  
  // Se não é pago nem vencido, então está pendente
  return "pending";
};

export const useTitleStatus = (initialTitles: FinancialTitle[]) => {
  const [titles, setTitles] = useState<FinancialTitle[]>([]);

  useEffect(() => {
    // Processar os títulos ao receber novos dados
    if (initialTitles && initialTitles.length > 0) {
      const processedTitles = initialTitles.map(title => ({
        ...title,
        status: checkTitleStatus(title)
      }));
      setTitles(processedTitles);
    } else {
      setTitles([]);
    }
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

    // Atualizar a cada minuto
    const interval = setInterval(updateTitlesStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return { titles, setTitles };
};
