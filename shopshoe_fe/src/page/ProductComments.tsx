import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Rating,
  Pagination,
} from "@mui/material";
import { iComment } from "../interface/Conmment";

const ProductComments = () => {
  const [comments, setComments] = useState<iComment[]>([]);
  const [productId] = useState("6714ffaf2c9f0f1a49e63cc9");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 4;

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const response = await axios.get(
      `http://localhost:8000/api/comments/${productId}`
    );
    setComments(response.data.data);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );

  return (
    <Container>
      <Typography sx={{ marginTop: "20px", marginBottom: "20px" }} variant="h4">
        Comments
      </Typography>

      <List>
        {currentComments?.length > 0 ? (
          currentComments.map((comment) => (
            <ListItem key={comment._id}>
              <ListItemText
                primary={
                  <>
                    <Typography variant="body1" fontWeight="bold">
                      {comment.userId.username}
                    </Typography>
                    <Rating
                      sx={{ marginLeft: "-8px" }}
                      value={comment.rating}
                      readOnly
                    />
                  </>
                }
                secondary={comment.comment}
              />
            </ListItem>
          ))
        ) : (
          <Typography>Chưa có lượt đánh giá nào.</Typography>
        )}
      </List>
      <Pagination
        count={Math.ceil(comments.length / commentsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default ProductComments;
