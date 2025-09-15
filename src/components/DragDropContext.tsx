import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { PromptCard } from "./PromptCard";
import { Prompt } from "@/types/prompt";

interface DragDropPromptListProps {
  prompts: Prompt[];
  onReorder: (reorderedPrompts: Prompt[]) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: string) => void;
  onCopy: (content: string) => void;
}

export function DragDropPromptList({
  prompts,
  onReorder,
  onEdit,
  onDelete,
  onCopy,
}: DragDropPromptListProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    const reorderedPrompts = Array.from(prompts);
    const [removed] = reorderedPrompts.splice(startIndex, 1);
    reorderedPrompts.splice(endIndex, 0, removed);

    onReorder(reorderedPrompts);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="prompts">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-2 min-h-[200px] transition-colors duration-200 flex flex-col items-center ${
              snapshot.isDraggingOver ? "bg-muted/20 rounded-lg p-1" : ""
            }`}
          >
            <AnimatePresence mode="popLayout">
              {prompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className="w-full flex justify-center"
                >
                  <Draggable draggableId={prompt.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="w-full"
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging
                            ? `${provided.draggableProps.style?.transform} rotate(2deg)`
                            : provided.draggableProps.style?.transform,
                        }}
                      >
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotateZ: snapshot.isDragging ? 2 : 0,
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{
                            duration: 0.2,
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className="w-full"
                        >
                          <PromptCard
                            prompt={prompt}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onCopy={onCopy}
                            isDragging={snapshot.isDragging}
                          />
                        </motion.div>
                      </div>
                    )}
                  </Draggable>
                </div>
              ))}
            </AnimatePresence>
            {provided.placeholder}

            {prompts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 w-[90%] mx-auto"
              >
                <div className="text-muted-foreground">
                  <div className="text-lg mb-2">📝</div>
                  <p>No prompts yet</p>
                  <p className="text-sm mt-1">
                    Click "New Prompt" to get started
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
