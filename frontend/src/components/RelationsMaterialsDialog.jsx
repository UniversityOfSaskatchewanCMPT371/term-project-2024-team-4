/* eslint-disable indent */
/* eslint-disable react/prop-types */
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";

/**
 * Displays a dialog showing the various relations associated with a materials.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.open - Whether the dialog is open.
 * @param {Function} props.onClose - Function to call when closing the dialog.
 * @param {object} props.materials - The materials whose relations are to be displayed.
 * @returns The dialog component.
 *
 * Pre-condition: The materials object must contain arrays for each type of relation.
 * Post-condition: Renders a dialog showing lists of relations or a message if there are none.
 */
export default function RelationsMaterialsDialog({ open, onClose, materials }) {
	if (!materials) return null;

	// Render a list of items with a title for a specific relation type.
	const renderRelationList = (items, title) => {
		if (items?.length > 0) {
			return (
				<>
					<Typography variant="h6" style={{ marginTop: 20 }}>
						{title}
					</Typography>
					<List>
						{items.map((item) => (
							<ListItem key={item.id}>
								<ListItemText primary={item.name} secondary={item.location} />
							</ListItem>
						))}
					</List>
				</>
			);
		}
		return null; // Return null if there are no items to display
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{materials.name} Relations</DialogTitle>
			<DialogContent>
				{materials.artifactType && (
					<>
						<Typography variant="h6" style={{ marginTop: 20 }}>
							Artifact Type
						</Typography>
						<Typography>{materials.artifactType.id}</Typography>
					</>
				)}
				{renderRelationList(materials.artifacts, "Artifacts")}
				{renderRelationList(materials.cultures, "Culture")}

				{!materials.artifacts?.length &&
					!materials.cultures?.length &&
					!materials.artifactType && (
						<Typography>No relations found for this material.</Typography>
					)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
