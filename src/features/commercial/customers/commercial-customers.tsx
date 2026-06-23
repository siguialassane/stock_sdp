import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { CustomerForm } from "@/features/commercial/customers/customer-form";
import { CustomerList } from "@/features/commercial/customers/customer-list";
import { commercialQueryKeys, useCommercialCustomersQuery } from "@/features/commercial/queries";
import {
  createCommercialCustomer,
  updateCommercialCustomer,
} from "@/features/commercial/services/commercial.service";
import type { CommercialCustomer, CommercialCustomerInput } from "@/features/commercial/types";

export function CommercialCustomers() {
  const queryClient = useQueryClient();
  const { data: customers = [], error: customersError } = useCommercialCustomersQuery();
  const [error, setError] = useState("");
  const [view, setView] = useState<"list" | "form">("list");
  const [editingCustomer, setEditingCustomer] = useState<CommercialCustomer | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customersError) {
      setError(customersError instanceof Error ? customersError.message : "Chargement impossible.");
      return;
    }

    setError("");
  }, [customersError]);

  const handleCreate = () => {
    setEditingCustomer(null);
    setView("form");
  };

  const handleEdit = (customer: CommercialCustomer) => {
    setEditingCustomer(customer);
    setView("form");
  };

  const handleSave = async (input: CommercialCustomerInput) => {
    setIsSaving(true);

    try {
      const savedCustomer = editingCustomer
        ? await updateCommercialCustomer(editingCustomer.id, input)
        : await createCommercialCustomer(input);

      queryClient.setQueryData<CommercialCustomer[]>(commercialQueryKeys.customers, (current = []) => {
        if (editingCustomer) {
          return current.map((customer) => (customer.id === savedCustomer.id ? savedCustomer : customer));
        }

        return [savedCustomer, ...current];
      });

      queryClient.invalidateQueries({ queryKey: commercialQueryKeys.customers });
      setView("list");
      setEditingCustomer(null);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Enregistrement impossible.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (customer: CommercialCustomer) => {
    try {
      const updated = await updateCommercialCustomer(customer.id, {
        fullName: customer.fullName,
        tier: customer.tier,
        phone: customer.phone,
        address: customer.address,
        notes: customer.notes,
        isActive: !customer.isActive,
      });

      queryClient.setQueryData<CommercialCustomer[]>(commercialQueryKeys.customers, (current = []) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      queryClient.invalidateQueries({ queryKey: commercialQueryKeys.customers });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Mise a jour impossible.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Le Commercial gere ici ses grossistes et demi-grossistes pour rattacher correctement les ventes."
        action={
          view === "form" ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setView("list");
                setEditingCustomer(null);
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour a la liste
            </Button>
          ) : (
            <Button type="button" onClick={handleCreate}>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          )
        }
      />

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {view === "form" ? (
        <CustomerForm
          initialCustomer={editingCustomer}
          isSaving={isSaving}
          onCancel={() => {
            setView("list");
            setEditingCustomer(null);
          }}
          onSubmit={handleSave}
        />
      ) : (
        <CustomerList
          customers={customers}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
}
