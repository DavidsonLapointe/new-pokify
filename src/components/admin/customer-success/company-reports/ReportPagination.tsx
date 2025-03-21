
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface ReportPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const ReportPagination = ({ currentPage, totalPages, setCurrentPage }: ReportPaginationProps) => {
  // Function to generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(1)} 
            />
          </PaginationItem>
        )}
        
        {renderPaginationItems()}
        
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(totalPages)} 
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
