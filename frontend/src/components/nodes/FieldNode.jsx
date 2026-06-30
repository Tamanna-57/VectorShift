import { useStore } from "@/store/useStore";
import { BaseNode } from "./BaseNode";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Generic, config-driven node body. Reads `config.fields` and renders the
 * matching control, persisting each value into the store via updateNodeField.
 * This is what makes adding a node a zero-boilerplate, config-only change.
 */
function Field({ nodeId, field, value, onChange }) {
  const common = { value: value ?? "", onChange: (e) => onChange(field.key, e.target.value) };

  return (
    <div className="space-y-1">
      <Label htmlFor={`${nodeId}-${field.key}`}>{field.label}</Label>
      {field.type === "select" ? (
        <Select id={`${nodeId}-${field.key}`} {...common}>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      ) : field.type === "textarea" ? (
        <Textarea
          id={`${nodeId}-${field.key}`}
          rows={3}
          placeholder={field.placeholder}
          className="nodrag"
          {...common}
        />
      ) : (
        <Input
          id={`${nodeId}-${field.key}`}
          placeholder={field.placeholder}
          className={cn("nodrag", field.mono && "font-mono text-xs")}
          {...common}
        />
      )}
    </div>
  );
}

export function makeFieldNode(config) {
  function FieldNode({ id, data, selected }) {
    const updateNodeField = useStore((s) => s.updateNodeField);
    const node = useStore((s) => s.nodes.find((n) => n.id === id));
    const values = node?.data ?? data ?? {};

    const handleChange = (key, val) => updateNodeField(id, key, val);

    return (
      <BaseNode id={id} config={config} selected={selected}>
        {(config.fields ?? []).map((field) => (
          <Field
            key={field.key}
            nodeId={id}
            field={field}
            value={values[field.key] ?? field.default ?? ""}
            onChange={handleChange}
          />
        ))}
      </BaseNode>
    );
  }
  FieldNode.displayName = `FieldNode(${config.type})`;
  return FieldNode;
}
