import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Eye } from "lucide-react"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
  title: string
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  onCreate?: () => void
  isLoading?: boolean
}

export function DataTable<T extends { [key: string]: any }>({
  title,
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  onCreate,
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Cargando...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {onCreate && (
          <Button onClick={onCreate}>
            Crear Nuevo
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.header}</TableHead>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableHead>Acciones</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render
                      ? column.render(item)
                      : item[column.key as keyof T]}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {onView && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onView(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos disponibles
          </div>
        )}
      </CardContent>
    </Card>
  )
}